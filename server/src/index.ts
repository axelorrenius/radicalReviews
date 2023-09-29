import fastify, { FastifyRegisterOptions, RegisterOptions } from 'fastify'
import cors from '@fastify/cors'

import userRoutes from './routes/user.route'
import forumRoutes from './routes/forum.route'

const server = fastify({logger: true})

server.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

server.register(userRoutes, {prefix: '/users'} as any)
server.register(forumRoutes, {prefix: '/forum'} as any)

server.get('/', async (request, reply) => {
  return 'Hello there! 👋'
})
server.get('/test', async (request, reply) => {
    return {json: true, hello: false}
})

server.listen({port: 8080}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Started server at ${address}`)

})