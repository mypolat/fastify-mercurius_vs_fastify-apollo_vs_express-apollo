import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const queryTrend = new Trend('query_duration')
const mutationTrend = new Trend('mutation_duration')

// Test configuration
export const options = {
    scenarios: {
        // Smoke test - basic functionality check
        smoke: {
            executor: 'constant-vus',
            vus: 1,
            duration: '30s',
            gracefulStop: '5s',
            tags: { test_type: 'smoke' },
        },
        // Load test - normal production load
        load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 50 },   // Ramp up
                { duration: '3m', target: 50 },   // Stay at 50
                { duration: '1m', target: 0 },    // Ramp down
            ],
            gracefulStop: '5s',
            tags: { test_type: 'load' },
        },
        // Stress test - find breaking point
        stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 100 },  // Ramp up to 100
                { duration: '5m', target: 100 },  // Stay at 100
                { duration: '2m', target: 200 },  // Ramp up to 200
                { duration: '5m', target: 200 },  // Stay at 200
                { duration: '2m', target: 300 },  // Ramp up to 300
                { duration: '5m', target: 300 },  // Stay at 300
                { duration: '2m', target: 0 },    // Ramp down
            ],
            gracefulStop: '5s',
            tags: { test_type: 'stress' },
        },
        // Spike test - sudden traffic spikes
        spike: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 100 },   // Quick ramp up
                { duration: '1m', target: 100 },    // Stay at 100
                { duration: '10s', target: 1000 },  // Spike to 1000
                { duration: '1m', target: 1000 },   // Stay at 1000
                { duration: '10s', target: 100 },   // Drop to 100
                { duration: '1m', target: 100 },    // Stay at 100
                { duration: '10s', target: 0 },     // Ramp down
            ],
            gracefulStop: '5s',
            tags: { test_type: 'spike' },
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],    // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],      // http errors should be less than 1%
        errors: ['rate<0.01'],               // custom errors should be less than 1%
        query_duration: ['p(95)<400'],       // 95% of queries should be below 400ms
        mutation_duration: ['p(95)<600'],     // 95% of mutations should be below 600ms
    },
}

// Server URLs
const URLS = {
    fastifyMercurius: 'http://localhost:3001/graphql',
    expressApollo: 'http://localhost:3002/graphql',
    fastifyApollo: 'http://localhost:3003/graphql'
}

// GraphQL Queries
const QUERIES = {
    simpleQuery: `
    query {
      users {
        id
        name
      }
    }
  `,
    complexQuery: `
    query {
      users {
        id
        name
        email
        posts {
          id
          title
          content
        }
      }
    }
  `,
    mutation: `
    mutation($name: String!, $email: String!) {
      createUser(name: $name, email: $email) {
        id
        name
        email
      }
    }
  `
}

// Helper function to make GraphQL requests
const makeRequest = (url, query, variables = {}, isQuery = true) => {
    const startTime = Date.now()

    const payload = JSON.stringify({
        query,
        variables
    })

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const response = http.post(url, payload, params)

    const duration = Date.now() - startTime

    // Record duration in appropriate trend
    if (isQuery) {
        queryTrend.add(duration)
    } else {
        mutationTrend.add(duration)
    }

    // Perform checks
    const success = check(response, {
        'is status 200': (r) => r.status === 200,
        'no errors': (r) => {
            const body = JSON.parse(r.body)
            return !body.errors
        },
        'has data': (r) => {
            const body = JSON.parse(r.body)
            return body.data !== null
        },
    })

    errorRate.add(!success)

    // Add think time between requests
    sleep(1)
}

// Main test function
export default function () {
    // Test each implementation
    Object.entries(URLS).forEach(([impl, url]) => {
        // Simple query test
        makeRequest(url, QUERIES.simpleQuery, {}, true)

        // Complex query test (with nested relationships)
        makeRequest(url, QUERIES.complexQuery, {}, true)

        // Mutation test
        const variables = {
            name: `Test User ${Date.now()}`,
            email: `test${Date.now()}@example.com`
        }
        makeRequest(url, QUERIES.mutation, variables, false)
    })
}
