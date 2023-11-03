import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { User } from "./user.entity"
import { Post } from "./post.entity"
import { Course } from "./course.entity"
import { CourseInstance } from "./course-instance.entity"

@Entity()
export class Thread {
    @PrimaryKey()
    id!: number

    @Property()
    title!: string

    @Property()
    content!: string

    @Property({ default: 0 })
    upVotes!: number

    @Property({ default: 0 })
    downVotes!: number

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne(() => User)
    createdBy!: User

    @ManyToOne(() => User, { nullable: true })
    updatedBy!: User

    @OneToMany(() => Post, (post) => post.thread)
    posts!: Collection<Post>

    @ManyToOne(() => CourseInstance)
    courseInstance!: CourseInstance

    tags?: string[]
}
