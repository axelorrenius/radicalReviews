import { EntityManager } from "@mikro-orm/postgresql"
import { Course } from "../database/entities/course.entity"
import { Thread } from "../database/entities/thread.entity"
import { Post } from "../database/entities/post.entity"
import { School } from "../database/entities/school.entity"

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
}
