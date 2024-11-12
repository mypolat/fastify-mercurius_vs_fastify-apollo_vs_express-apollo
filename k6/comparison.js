import http from 'k6/http'
import { check, sleep } from 'k6'

// Sadece 10 saniye test et
export const options = {
    vus: 500,
    duration: '600s'
}

export default function () {
    // Test Fastify + Mercurius
    let res1 = http.post('http://localhost:3001/graphql', JSON.stringify({
        query: `{ users { id name } }`
    }), {
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Fastify + Mercurius response time: ' + res1.timings.duration + 'ms')
    sleep(1)

    // Test Express + Apollo
    let res2 = http.post('http://localhost:3002/graphql', JSON.stringify({
        query: `{ users { id name } }`
    }), {
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Express + Apollo response time: ' + res2.timings.duration + 'ms')
    sleep(1)

    // Test Fastify + Apollo
    let res3 = http.post('http://localhost:3003/graphql', JSON.stringify({
        query: `{ users { id name } }`
    }), {
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Fastify + Apollo response time: ' + res3.timings.duration + 'ms')
    sleep(1)
}
