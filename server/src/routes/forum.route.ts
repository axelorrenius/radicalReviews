import { FastifyInstance, RouteOptions } from 'fastify'

//Routes for forum data

export default async function forumRoutes (fastify: FastifyInstance, options: RouteOptions) {
    fastify.get('/', async (request, reply) => {
        return 'Hello there! 👋'
    })
}
