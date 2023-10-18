import { EntityManager } from "@mikro-orm/postgresql";
import { Course } from "../database/entities/course.entity";
import { Thread } from "../database/entities/forum.entity";
import { Post } from "../database/entities/post.entity";

export class CourseController {
    constructor(private em: EntityManager) {}

    async searchCourses(schoolId: number, searchTerm: string): Promise<Course[]> {
        let query = this.em.createQueryBuilder(Course, "c")
            .select(['c.courseId', 'c.courseCode', 'c.courseName', "s.schoolName"])
            .join('c.school', 's')

        if (schoolId && schoolId > 0) {
            query = query.where({ school: schoolId })
        }

        if (searchTerm) {
            query = query.where({ $or: [{ courseCode: { $ilike: `%${searchTerm}%` } }, { courseName: { $ilike: `%${searchTerm}%` } }] })
        }

        return await query.execute()
    }

    async searchPosts(courseId: number, searchTerm: string): Promise<Post[]> {
        let query = this.em.createQueryBuilder(Post, "p")
            .select("*")
            .where({ course: courseId, content: { $ilike: `%${searchTerm}%` } })
            .orderBy({ upVotes: 'DESC', downVotes: 'ASC', createdAt: 'DESC' })

        return await query.execute()
    }

    async getCourse(courseId: number): Promise<Course | null> {
        return await this.em.findOne(Course, { id: courseId, }, { populate: ['school'] })
    }

    async getThreads(courseId: number): Promise<Thread[]> {
        return await this.em.find(Thread, { course: courseId })
    }

    async getPosts(threadId: number): Promise<Post[]> {
        return await this.em.find(Post, { thread: threadId })
    }
}