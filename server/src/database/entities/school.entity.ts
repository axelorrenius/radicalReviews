import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { User } from "./user.entity"
import { Course } from "./course.entity"

@Entity()
export class School {
    @PrimaryKey()
    id!: number

    @Property()
    schoolName!: string

    @Property()
    description!: string

    @OneToMany(() => Course, (course) => course.school)
    courses!: Course[]

    @OneToMany(() => User, (user) => user.school)
    users!: User[]
}
