import { EntityManager } from "@mikro-orm/postgresql"
import { Course } from "../database/entities/course.entity"
import { Thread } from "../database/entities/thread.entity"
import { Post } from "../database/entities/post.entity"
import { School } from "../database/entities/school.entity"
import { RequestUser } from "../routes/util"
import { User } from "../database/entities/user.entity"
import { CourseInstance } from "../database/entities/course-instance.entity"
import { EntityType } from "../database/enums"
import { Tag } from "../database/entities/tag.entity"
import { TagInstance } from "../database/entities/tag-instance.entity"
import { CourseDTO } from "../routes/course.route"

interface QueryResult {
    entityType: string
    entityId: number
    description: string
}

export class CourseController {
    constructor(private em: EntityManager) {}

    async searchCourses(
        schoolId: number,
        searchTerm: string
    ): Promise<QueryResult[]> {
        let query = this.em
            .createQueryBuilder(Course, "c")
            .select([
                "c.id",
                "c.courseCode",
                "c.courseName",
            ])
            .join("c.school", "s")

        if (schoolId && schoolId > 0) {
            query = query.where({ school: schoolId })
        }

        if (searchTerm) {
            query = query.where({
                $or: [
                    { courseCode: { $ilike: `%${searchTerm}%` } },
                    { courseName: { $ilike: `%${searchTerm}%` } }
                ]
            })
        }

        const result = await query.execute()
        return result.map((course) => {
            return {
                entityId: course.id,
                description: `${course.courseCode} - ${course.courseName}`,
                entityType: "course"
            }
        })
    }

    async createOrUpdateCourse(
        user: RequestUser,
        options: {
            id: number | null
            courseCode: string
            courseName: string
            description: string
            schoolId: number
            tags?: string[]
        }
    ) {
        const { id, schoolId, courseCode, courseName, description, tags } =
            options

        if (!schoolId)
            return {
                success: false,
                reason: "School is not selected"
            }

        const existingCourse = await this.em.findOne(Course, {
            courseCode: courseCode
        })
        if (existingCourse && existingCourse.id)
            return {
                success: false,
                reason: "Course code already exists, create a new course round instead"
            }

        if (!courseCode || !courseName || !description)
            return {
                success: false,
                reason: "Missing required fields"
            }

        const course = this.em.create(Course, {
            ...new Course(),
            courseCode,
            courseName,
            description,
            school: this.em.getReference(School, schoolId)
        })

        await this.addExperience(user.id, 20)

        this.em.persist(course)
        if (!course.id) await this.em.flush()
        if (tags)
            await this.addTags(EntityType.Course, course.id, options.tags || [])
        await this.em.flush()
        return { course: course, success: true }
    }

    async createOrUpdateCourseInstance(
        user: RequestUser,
        options: {
            id: number | null
            courseId: number
            roundName: string
            roundStart: Date
            roundEnd: Date
            examDate: Date | null
            tags?: string[]
        }
    ) {
        const {
            id,
            courseId,
            roundName,
            roundStart,
            roundEnd,
            examDate,
            tags
        } = options

        const course = this.em.getReference(Course, courseId)
        const courseInstance = id
            ? await this.em.findOne(CourseInstance, { id: id })
            : this.em.create(CourseInstance, {
                  ...new CourseInstance(course)
              })

        if (!courseInstance) {
            return null
        }

        if (!id) {
            await this.addExperience(user.id, 10)
        }

        courseInstance.roundName = roundName
        courseInstance.roundStart = roundStart
        courseInstance.roundEnd = roundEnd
        courseInstance.examDate = examDate || undefined

        await this.em.persist(courseInstance)
        await this.em.flush()
        if (tags)
            await this.addTags(
                EntityType.CourseInstance,
                courseInstance.id,
                tags
            )

        await this.em.flush()
        return courseInstance
    }

    async createOrUpdateSchool(
        user: RequestUser,
        id: number | null,
        schoolName: string,
        description: string
    ) {
        const school = id ? await this.em.findOne(School, { id }) : new School()

        if (!school) {
            return null
        }

        school.schoolName = schoolName
        school.description = description

        await this.em.persistAndFlush(school)
        return school
    }
    async createOrUpdateThread(
        user: RequestUser,
        options: {
            id: number | null
            courseInstanceId: number
            title: string
            content: string
            tags?: string[]
        }
    ) {
        const { id, courseInstanceId, title, content, tags } = options
        const thread = id
            ? await this.em.findOne(Thread, { id })
            : this.em.create(Thread, {
                  ...new Thread()
              })

        if (!thread) {
            return null
        }

        if (!thread.id) {
            thread.courseInstance = this.em.getReference(
                CourseInstance,
                courseInstanceId
            )
            thread.createdBy = this.em.getReference(User, user.id)
            await this.addExperience(user.id, 10)
        } else {
            thread.updatedBy = this.em.getReference(User, user.id)
        }

        thread.content = content
        thread.title = title

        await this.em.persist(thread)
        await this.em.flush()
        if (tags) await this.addTags(EntityType.Thread, thread.id, tags)
        await this.em.flush()
        return thread
    }

    async createOrUpdatePost(
        user: RequestUser,
        id: number | null,
        threadId: number,
        content: string
    ) {
        const post = id
            ? await this.em.findOne(Post, { id })
            : this.em.create(Post, {
                  ...new Post()
              })

        if (!post) {
            return null
        }

        if (!post.id) {
            post.thread = this.em.getReference(Thread, threadId)
            post.createdBy = this.em.getReference(User, user.id)
            post.upVotes = 0
            post.downVotes = 0
            await this.addExperience(user.id, 5)
        }

        post.content = content

        await this.em.persist(post)
        await this.em.flush()
        return post
    }

    async addTags(entityType: EntityType, entityId: number, tags: string[]) {
        tags = [...new Set(tags)]
        const existingTags = await (
            await this.em.find(Tag, { entityType: entityType, name: tags })
        ).reduce(
            (acc, tag) => {
                acc[tag.name] = tag
                return acc
            },
            {} as { [key: string]: Tag }
        )

        const existingsTagInstances = await (
            await this.em.find(TagInstance, {
                entityId: entityId,
                tag: { entityType }
            })
        ).reduce(
            (acc, tagInstance) => {
                acc[tagInstance.tag.id] = tagInstance
                return acc
            },
            {} as { [tagId: number]: TagInstance }
        )

        for (const tagName of tags) {
            const tag =
                existingTags[tagName] ||
                this.em.create(Tag, { ...new Tag(tagName, entityType) })

            if (existingsTagInstances[tag.id]) continue


            const tagInstance = this.em.create(TagInstance, {
                ...new TagInstance(),
                tag,
                entityId
            })
            this.em.persist(tagInstance)
        }
    }

    async getTags<T extends { id: number; tags?: string[] }>(
        entityType: EntityType,
        entities: T[]
    ) {
        const ids = entities.map((entity) => entity.id)
        const tagInstances = await this.em.find(
            TagInstance,
            { entityId: ids, tag: { entityType: entityType } },
            { populate: ["tag"] }
        )
        const tags = tagInstances.reduce(
            (acc, tagInstance) => {
                if (!acc[tagInstance.entityId])
                    acc[tagInstance.entityId] = [tagInstance.tag.name]
                else acc[tagInstance.entityId].push(tagInstance.tag.name)
                return acc
            },
            {} as { [entityId: number]: string[] }
        )
        this.mapTags(entities, tags)
    }

    mapTags<T extends { id: number; tags?: string[] }>(
        entities: T[],
        tags: { [entityId: number]: string[] }
    ) {
        for (const entity of entities) {
            entity.tags = tags[entity.id]
        }
    }

    async searchPosts(courseId: number, searchTerm: string): Promise<QueryResult[]> {
        let query = this.em
            .createQueryBuilder(Post, "p")
            .select(["p.id", "p.content"])
            .where({ thread: 
                { courseInstance: 
                    { course: courseId } 
                }, 
                content: 
                { $ilike: `%${searchTerm}%` } 
            })
            .orderBy({ upVotes: "DESC", downVotes: "ASC", createdAt: "DESC" })
            .limit(10)

        let threadQuery = this.em
            .createQueryBuilder(Thread, "t")
            .select(["t.id", "t.content", "t.title"])
            .where({ courseInstance: 
                { course: courseId }, 
                $or: [ 
                    {content: { $ilike: `%${searchTerm}%` }}, 
                    {title: { $ilike: `%${searchTerm}%` }}
                ]
            })
            .orderBy({ upVotes: "DESC", downVotes: "ASC", createdAt: "DESC" })
            .limit(10)

        const [postsRaw, threadsRaw] = await Promise.all([query.execute(), threadQuery.execute()])
        const posts = postsRaw.map((post) => {
            return {
                entityType: "thread",
                entityId: post.id,
                description: post.content.substring(0, 100)
            }
        })
        const threads = threadsRaw.map((thread) => {
            return {
                entityType: "thread",
                entityId: thread.id,
                description: thread.title.substring(0, 100)
            }
        })
        return threads.concat(posts)
    }

    async getCourse(courseId: number): Promise<Course | null> {
        return await this.em.findOne(
            Course,
            { id: courseId },
            { populate: ["school", "courseInstances"] }
        )
    }

    async getCoursesBySchool(schoolId: number): Promise<Course[]> {
        const courses = await this.em.find(Course, { school: schoolId })
        await this.getTags(EntityType.Course, courses)
        return courses
    }

    async getThreads(
        courseId: number,
        courseInstanceId?: number
    ): Promise<Thread[]> {
        let where: any = { courseInstance: { course: courseId } }
        if (courseInstanceId) where.courseInstance.id = courseInstanceId
        const threads = await this.em.find(Thread, where, {
            populate: ["createdBy", "courseInstance"],
            orderBy: { upVotes: "DESC", downVotes: "ASC", createdAt: "DESC" }
        })
        threads.sort((a, b) => {
            return (b.upVotes - b.downVotes) - (a.upVotes - a.downVotes)
        })
        await this.getTags(EntityType.Thread, threads)
        return threads
    }

    async getThread(threadId: number): Promise<Thread | null> {
        return await this.em.findOne(
            Thread,
            { id: threadId },
            {
                populate: [
                    "createdBy",
                    "updatedBy",
                    "posts",
                    "posts.comments",
                    "posts.createdBy",
                    "courseInstance"
                ]
            }
        )
    }

    async getPosts(threadId: number): Promise<Post[]> {
        return await this.em.find(Post, { thread: threadId })
    }

    async getSchools(): Promise<School[]> {
        return await this.em.find(School, {})
    }

    async setPreferredSchool(userId: number, schoolId: number) {
        const user = this.em.getReference(User, userId)
        const school = this.em.getReference(School, schoolId)
        user.school = school
        await this.em.persistAndFlush(user)
    }

    async voteOnPost(postId: number, up: boolean): Promise<void> {
        const post = await this.em.findOne(Post, { id: postId })

        if (!post) {
            return
        }

        if (up) {
            post.upVotes += 1
            await this.addExperience(post.createdBy.id, 1)
        } else {
            post.downVotes += 1
        }

        await this.em.persist(post)
        await this.em.flush()
    }

    async voteOnThread(threadId: number, up: boolean): Promise<void> {
        const thread = await this.em.findOne(Thread, { id: threadId })

        if (!thread) {
            return
        }

        if (up) {
            thread.upVotes += 1
            await this.addExperience(thread.createdBy.id, 1)
        } else {
            thread.downVotes += 1
        }

        await this.em.persist(thread)
        await this.em.flush()
    }

    async addExperience(userId: number, experience: number) {
        const user = await this.em.findOne(User, { id: userId })
        if (!user) return
        user.experience += experience
        await this.em.persist(user)
    }
}
