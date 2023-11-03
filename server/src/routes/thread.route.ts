import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { controllers as c } from "../controllers"
//Routes for forum data

interface UserDTO {
    id: number
    avatar?: string
    username: string
    level: number
    experience: number
}

interface ThreadDTO {
    id: number
    courseId?: number
    courseInstanceId: number
    title: string
    upVotes: number
    downVotes: number
    content: string
    createdAt: Date
    updatedAt: Date
    posts: PostDTO[]
    tags: string[]
    user: UserDTO
}

interface PostDTO {
    id?: number
    threadId: number
    content: string
    upVotes: number
    downVotes: number
    createdAt?: Date
    updatedAt?: Date
    comments: CommentDTO[]
    user: UserDTO
}

interface CommentDTO {
    id: number
    postId: number
    content: string
    createdAt: Date
    updatedAt: Date
}

export default async function threadRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.get<{ Params: { threadId: number } }>(
        "/:threadId",
        async (request, reply): Promise<ThreadDTO | null> => {
            const { threadId } = request.params
            console.log(request.params)
            const thread = await c?.courseController.getThread(threadId)
            if (!thread) return null

            return {
                id: thread.id,
                title: thread.title,
                downVotes: thread.downVotes,
                upVotes: thread.upVotes,
                content: thread.content,
                createdAt: thread.createdAt,
                updatedAt: thread.updatedAt,
                courseInstanceId: thread.courseInstance.id,
                courseId: thread.courseInstance.course.id,
                tags: thread.tags || [],
                user: {
                    id: thread.createdBy.id,
                    username: thread.createdBy.username,
                    avatar: thread.createdBy.avatar,
                    level: thread.createdBy.level || 0,
                    experience: thread.createdBy.experience
                },
                posts: thread.posts.map((post) => {
                    return {
                        id: post.id,
                        threadId: post.thread.id,
                        content: post.content,
                        upVotes: post.upVotes,
                        downVotes: post.downVotes,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        comments: post.comments.map((comment) => {
                            return {
                                id: comment.id,
                                postId: comment.post.id,
                                content: comment.content,
                                createdAt: comment.createdAt,
                                updatedAt: comment.updatedAt
                            }
                        }),
                        user: {
                            id: post.createdBy.id,
                            avatar: post.createdBy.avatar,
                            username: post.createdBy.username,
                            level: post.createdBy.level || 0,
                            experience: post.createdBy.experience
                        }
                    }
                })
            }
        }
    )

    fastify.post<{ Body: ThreadDTO }>("", async (request, reply) => {
        const user = request.user
        const { id, courseInstanceId, title, content, tags } = request.body
        const result = await c?.courseController.createOrUpdateThread(user, {
            id,
            courseInstanceId,
            title,
            content,
            tags
        })
        return reply.code(200).send(result)
    })

    fastify.post<{ Params: { threadId: number } }>(
        "/:threadId/upvote",
        async (request, reply) => {
            const { threadId } = request.params
            await c?.courseController.voteOnThread(threadId, true)
            return reply.code(200).send({ success: true })
        }
    )

    fastify.post<{ Params: { threadId: number } }>(
        "/:threadId/downvote",
        async (request, reply) => {
            const { threadId } = request.params
            await c?.courseController.voteOnThread(threadId, false)
            return reply.code(200).send({ success: true })
        }
    )

    fastify.post<{ Params: { threadId: number }; Body: PostDTO }>(
        "/:threadId/posts",
        async (request, reply) => {
            const user = request.user
            const { threadId } = request.params
            const { id, content } = request.body
            const post = await c?.courseController.createOrUpdatePost(
                user,
                id || null,
                threadId,
                content
            )
            return reply.code(200).send(post)
        }
    )

    fastify.post<{ Params: { threadId: number; postId: number } }>(
        "/:threadId/posts/:postId/upvote",
        async (request, reply) => {
            const { postId } = request.params
            await c?.courseController.voteOnPost(postId, true)
            return reply.code(200).send({ success: true })
        }
    )

    fastify.post<{ Params: { threadId: number; postId: number } }>(
        "/:threadId/posts/:postId/downvote",
        async (request, reply) => {
            const { postId } = request.params
            await c?.courseController.voteOnPost(postId, true)
            return reply.code(200).send({ success: true })
        }
    )
}
