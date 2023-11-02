import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"
//Routes for forum data

export interface CourseDTO {
    id: number
    schoolId: number
    courseCode: string
    courseName: string
    description: string
    tags?: string[]
}

export default async function courseRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post<{ Body: CourseDTO }>("", async (request, reply) => {
        const { user } = request
        const { id, courseName, courseCode, description, schoolId, tags } =
            request.body
        return await c?.courseController.createOrUpdateCourse(user, {
            id: id || null,
            courseCode,
            courseName,
            description,
            schoolId,
            tags
        })
    })
    fastify.post<{ Body: { query: string; schoolId: number } }>(
        "/search",
        async (request, reply) => {
            const { query, schoolId } = request.body

            return await c?.courseController.searchCourses(schoolId, query)
        }
    )
    fastify.get<{ Params: { courseId: number } }>(
        "/:courseId",
        async (request, reply) => {
            const { courseId } = request.params
            return await c?.courseController.getCourse(courseId)
        }
    )

    fastify.get<{ Params: { schoolId: number } }>(
        "/bySchool/:schoolId",
        async (request, reply) => {
            const { schoolId } = request.params
            return (
                (await c?.courseController.getCoursesBySchool(schoolId)) || []
            )
        }
    )

    fastify.get<{ Params: { courseId: number } }>(
        "/:courseId/threads",
        async (request, reply) => {
            const { courseId } = request.params
            const threads = await c?.courseController.getThreads(courseId)

            if (!threads) return []

            return threads.map((thread) => {
                return {
                    id: thread.id,
                    courseId: thread.course.id,
                    title: thread.title,
                    content: thread.content,
                    createdAt: thread.createdAt,
                    updatedAt: thread.updatedAt
                }
            })
        }
    )
}
