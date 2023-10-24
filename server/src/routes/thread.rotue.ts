import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"
//Routes for forum data

interface ThreadDTO {
    id: number
    courseName: string
    description: string
    schoolId: number
}

export default async function courseRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.get<{ Params: { threadId: number } }>(
        "/:threadId",
        async (request, reply) => {
            const { threadId } = request.params
            return await c?.courseController.getThread(threadId)
        }
    )
}
