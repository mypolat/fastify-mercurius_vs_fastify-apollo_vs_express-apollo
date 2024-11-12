import Fastify from 'fastify'
import mercurius from 'mercurius'
import { schema, resolvers } from '../schema'

const PORT = process.env.PORT || 3001

async function startServer() {
    const app = Fastify({
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
        jit: 1, // Enable JIT
        cache: true,
        context: (request, reply) => {
            return {
                // Add any context you need
                request,
                reply
            }
        }
    })

    try {
        await app.listen({ port: PORT })
        console.log(`Fastify + Mercurius server running at http://localhost:${PORT}/graphql`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

startServer()
