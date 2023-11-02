import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { User } from "./user.entity"
import { CourseRole } from "../enums"
import { CourseInstance } from "./course-instance.entity"

@Entity()
export class UserCourse {
    @PrimaryKey()
    id!: number

    @ManyToOne(() => User)
    user!: User

    @ManyToOne(() => CourseInstance)
    course!: CourseInstance

    @Property()
    enrolledDate!: Date

    @Property()
    role!: CourseRole
}
