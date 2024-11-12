import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import { schema, resolvers } from '../schema'

const PORT = parseInt(process.env.PORT || '3002', 10)

async function startServer(): Promise<void> {
    const app = express()

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

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({
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
