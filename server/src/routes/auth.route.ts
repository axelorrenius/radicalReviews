import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"

export default async function authRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.get("/me", async (request, reply) => {
        return request.user
    })

    fastify.post<{ Body: { username: string; password: string } }>(
        "/login",
        async (request, reply) => {
            const { username, password } = request.body
            return await c?.authController.login(username, password)
        }
    )

    fastify.post<{
        Body: {
            email: string
            password: string
            username: string
            programDescription?: string
            description?: string
            schoolId?: number
            phoneNumber?: string
        }
    }>("/register", async (request, reply) => {
        console.log(request.body)
        return await c?.authController.register(request.body)
    })
}
