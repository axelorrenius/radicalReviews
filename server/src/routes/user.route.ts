import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"

export default async function userRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post<{
        Body: { schoolId: number }
    }>("/preferred-school", async (request, reply) => {
        const { id } = request.user
        const { schoolId } = request.body
        await c?.courseController.setPreferredSchool(id, schoolId)
        return reply.code(200).send(null)
    })
}
