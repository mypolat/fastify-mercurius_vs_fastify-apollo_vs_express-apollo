import Fastify, { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import { schema, resolvers } from '../schema'

const PORT = parseInt(process.env.PORT || '3001', 10)

async function startServer(): Promise<void> {
    const app: FastifyInstance = Fastify({
        logger: {
            level: 'error',
            transport: {
                target: 'pino-pretty'
            }
        }
    })

    // Register Mercurius
    await app.register(mercurius, {
        schema,
        resolvers,
        graphiql: false,
        jit: 1,
        cache: true,
        context: (request, reply) => {
            return {
                request,
                reply
            }
        }
    })

    try {
        await app.listen({ port: PORT, host: '0.0.0.0' })
        console.log(`Fastify + Mercurius server running at http://localhost:${PORT}/graphql`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

startServer()
