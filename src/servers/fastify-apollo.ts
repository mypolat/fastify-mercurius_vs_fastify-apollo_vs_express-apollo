import Fastify from 'fastify'
import { ApolloServer } from '@apollo/server'
import { fastifyApolloHandler } from '@as-integrations/fastify'
import { schema, resolvers } from '../schema'

const PORT = process.env.PORT || 3003

async function startServer() {
    const app = Fastify({
        logger: {
            level: 'error',
            transport: {
                target: 'pino-pretty'
            }
        }
    })

    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
        introspection: false,
        cache: 'bounded',
        plugins: [
            {
                async requestDidStart({ request, context }) {
                    const start = Date.now()
                    return {
                        async willSendResponse({ response }) {
                            const stop = Date.now()
                            const time = stop - start
                            console.log(`Request processed in ${time}ms`)
                        }
                    }
                }
            }
        ]
    })

    await server.start()

    // Register Apollo handler
    app.route({
        url: '/graphql',
        method: ['POST', 'OPTIONS'],
        handler: fastifyApolloHandler(server, {
            context: async (request, reply) => ({
                // Add any context you need
                request,
                reply
            })
        })
    })

    try {
        await app.listen({ port: PORT })
        console.log(`Fastify + Apollo server running at http://localhost:${PORT}/graphql`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

startServer()
