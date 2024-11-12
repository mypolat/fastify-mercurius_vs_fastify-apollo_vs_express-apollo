import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import { schema, resolvers } from '../schema'

const PORT = process.env.PORT || 3002

async function startServer() {
    const app = express()

    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
        introspection: false,
        // Apollo specific optimizations
        cache: 'bounded',
        plugins: [
            {
                // Simple plugin to log response times
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

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({
                // Add any context you need
                request: req,
                response: res
            })
        })
    )

    app.listen(PORT, () => {
        console.log(`Express + Apollo server running at http://localhost:${PORT}/graphql`)
    })
}

startServer()
