import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"
//Routes for forum data

interface SchoolDTO {
    id: number
    schoolName: string
    description: string
}

export default async function schoolRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.get("", async (request, reply) => {
        return await c?.courseController.getSchools()
    })
    fastify.post<{ Body: SchoolDTO }>("", async (request, reply) => {
        const user = request.user
        const { id, schoolName, description } = request.body
        return await c?.courseController.createOrUpdateSchool(
            user,
            id,
            schoolName,
            description
        )
    })
}
