import { FastifyInstance, RouteOptions } from 'fastify'

//Routes for retrieving user information

export default async function userRoutes (fastify: FastifyInstance, options: RouteOptions) {
    fastify.get('/', async (request, reply) => {
        return 'Hello there! 👋'
    })
}
