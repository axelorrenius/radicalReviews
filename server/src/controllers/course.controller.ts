import { EntityManager } from "@mikro-orm/postgresql"
import { Course } from "../database/entities/course.entity"
import { Thread } from "../database/entities/thread.entity"
import { Post } from "../database/entities/post.entity"
import { School } from "../database/entities/school.entity"
import { RequestUser } from "../routes/util"
import { User } from "../database/entities/user.entity"

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
        id: number | null,
        courseName: string,
        description: string,
        schoolId: number
    ) {
        const course = id ? await this.em.findOne(Course, { id }) : new Course()

        if (!course) {
            return null
        }

        if (!id) {
            course.school = this.em.getReference(School, schoolId)
        }

        course.courseName = courseName
        course.description = description

        await this.em.persistAndFlush(course)
        return course
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
        id: number | null,
        courseId: number,
        title: string,
        content: string
    ) {
        console.log(id)
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
        } else {
            thread.updatedBy = this.em.getReference(User, user.id)
        }

        thread.content = content
        thread.title = title

        console.log(thread)

        await this.em.persistAndFlush(thread)
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
        }

        post.content = content

        await this.em.persistAndFlush(post)
        return post
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
        return await this.em.find(Course, { school: schoolId })
    }

    async getThreads(courseId: number): Promise<Thread[]> {
        return await this.em.find(
            Thread,
            { course: courseId },
            { populate: ["createdBy"] }
        )
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
        } else {
            post.downVotes += 1
        }

        await this.em.persistAndFlush(post)
    }

    async voteOnThread(threadId: number, up: boolean): Promise<void> {
        const thread = await this.em.findOne(Thread, { id: threadId })

        if (!thread) {
            return
        }

        if (up) {
            thread.upVotes += 1
        } else {
            thread.downVotes += 1
        }

        await this.em.persistAndFlush(thread)
    }
}
