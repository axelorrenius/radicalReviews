import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { Course } from "./course.entity"
import { UserCourse } from "./user-course.entity"
import { Thread } from "./thread.entity"

@Entity()
export class CourseInstance {
    @PrimaryKey()
    id!: number

    @Property()
    roundName!: string

    @Property()
    roundStart!: Date

    @Property()
    roundEnd!: Date

    @Property({ nullable: true })
    examDate?: Date

    @ManyToOne(() => Course)
    course!: Course

    @OneToMany(() => UserCourse, (userCourse) => userCourse.course)
    userCourses!: Collection<UserCourse>

    @OneToMany(() => Thread, (thread) => thread.courseInstance)
    threads!: Collection<Thread>

    constructor(course: Course) {
        this.course = course
    }
}
