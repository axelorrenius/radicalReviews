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

        const course = await c?.courseController.createOrUpdateCourse(user, {
            id: id || null,
            courseCode,
            courseName,
            description,
            schoolId,
            tags
        })
        console.log(course)
        return reply.code(200).send(course)
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
        "/by-school/:schoolId",
        async (request, reply) => {
            const { schoolId } = request.params
            const courses =
                (await c?.courseController.getCoursesBySchool(schoolId)) || []

            return reply.code(200).send(
                courses.map((course) => {
                    return {
                        id: course.id,
                        schoolId: course.school.id,
                        courseCode: course.courseCode,
                        courseName: course.courseName,
                        description: course.description,
                        tags: course.tags
                    }
                })
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
