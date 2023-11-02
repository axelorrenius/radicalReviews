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

export class CourseController {
    constructor(private em: EntityManager) {}

    async searchCourses(
        schoolId: number,
        searchTerm: string
    ): Promise<Course[]> {
        let query = this.em
            .createQueryBuilder(Course, "c")
            .select([
                "c.courseId",
                "c.courseCode",
                "c.courseName",
                "s.schoolName"
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

        return await query.execute()
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

        const course = options.id
            ? await this.em.findOne(Course, { id: id })
            : this.em.create(Course, { ...new Course() })

        if (!course) {
            return null
        }

        if (!id) {
            if (!schoolId) return null
            const existingCourse = await this.em.findOne(Course, {
                courseCode: courseCode
            })
            if (existingCourse) return null
            course.school = this.em.getReference(School, schoolId)
            this.addExperience(user.id, 20)
        }

        if (!courseCode || !courseName || !description) return null

        course.courseCode = courseCode
        course.courseName = courseName
        course.description = description

        this.em.persist(course)
        await this.em.flush()
        if (tags) this.addTags(EntityType.Course, course.id, options.tags || [])

        await this.em.flush()
        return course
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
            this.addExperience(user.id, 10)
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
            courseId: number
            title: string
            content: string
            tags?: string[]
        }
    ) {
        const { id, courseId, title, content, tags } = options
        const thread = id
            ? await this.em.findOne(Thread, { id })
            : this.em.create(Thread, {
                  ...new Thread()
              })

        if (!thread) {
            return null
        }

        if (!thread.id) {
            thread.course = this.em.getReference(Course, courseId)
            thread.createdBy = this.em.getReference(User, user.id)
            this.addExperience(user.id, 10)
        } else {
            thread.updatedBy = this.em.getReference(User, user.id)
        }

        thread.content = content
        thread.title = title

        await this.em.persist(thread)
        await this.em.flush()
        if (tags) this.addTags(EntityType.Thread, thread.id, tags)
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
            this.addExperience(user.id, 5)
        }

        post.content = content

        await this.em.persist(post)
        await this.em.flush()
        return post
    }

    async addTags(entityType: EntityType, entityId: number, tags: string[]) {
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
            await this.em.find(TagInstance, { entityId: entityId })
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
                ...new TagInstance(entityId, tag)
            })
            this.em.persist(tagInstance)
            this.em.persist(tag)
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

    async mapTags<T extends { id: number; tags?: string[] }>(
        entities: T[],
        tags: { [entityId: number]: string[] }
    ) {
        for (const entity of entities) {
            entity.tags = tags[entity.id]
        }
    }

    async searchPosts(courseId: number, searchTerm: string): Promise<Post[]> {
        let query = this.em
            .createQueryBuilder(Post, "p")
            .select("*")
            .where({ course: courseId, content: { $ilike: `%${searchTerm}%` } })
            .orderBy({ upVotes: "DESC", downVotes: "ASC", createdAt: "DESC" })

        return await query.execute()
    }

    async getCourse(courseId: number): Promise<Course | null> {
        return await this.em.findOne(
            Course,
            { id: courseId },
            { populate: ["school"] }
        )
    }

    async getCoursesBySchool(schoolId: number): Promise<Course[]> {
        const courses = await this.em.find(Course, { school: schoolId })
        await this.getTags(EntityType.Course, courses)
        return courses
    }

    async getThreads(courseId: number): Promise<Thread[]> {
        const threads = await this.em.find(
            Thread,
            { course: courseId },
            { populate: ["createdBy"] }
        )
        await this.getTags(EntityType.Thread, threads)
        return threads
    }

    async getThread(threadId: number): Promise<Thread | null> {
        return await this.em.findOne(
            Thread,
            { id: threadId },
            { populate: ["createdBy", "updatedBy", "posts", "posts.comments"] }
        )
    }

    async getPosts(threadId: number): Promise<Post[]> {
        return await this.em.find(Post, { thread: threadId })
    }

    async getSchools(): Promise<School[]> {
        return await this.em.find(School, {})
    }

    async voteOnPost(postId: number, up: boolean): Promise<void> {
        const post = await this.em.findOne(Post, { id: postId })

        if (!post) {
            return
        }

        if (up) {
            post.upVotes += 1
            this.addExperience(post.createdBy.id, 1)
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
            this.addExperience(thread.createdBy.id, 1)
        } else {
            thread.downVotes += 1
        }

        await this.em.persist(thread)
        await this.em.flush()
    }

    async addExperience(userId: number, experience: number) {
        const user = this.em.getReference(User, userId)
        user.experience += experience
        await this.em.persist(user)
    }
}
