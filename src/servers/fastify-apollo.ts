import Fastify, { FastifyInstance } from 'fastify'
import { ApolloServer } from '@apollo/server'
import { fastifyApolloHandler } from '@as-integrations/fastify'
import { schema, resolvers } from '../schema'

const PORT = parseInt(process.env.PORT || '3003', 10)

async function startServer(): Promise<void> {
    const app: FastifyInstance = Fastify({
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
        plugins: [
            {
                async requestDidStart() {
                    const start = Date.now()
                    return {
                        async willSendResponse() {
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

    app.route({
        url: '/graphql',
        method: ['POST', 'OPTIONS'],
        handler: fastifyApolloHandler(server, {
            context: async (request, reply) => ({
                request,
                reply
            })
        })
    })

    try {
        await app.listen({ port: PORT, host: '0.0.0.0' })
        console.log(`Fastify + Apollo server running at http://localhost:${PORT}/graphql`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

startServer()
