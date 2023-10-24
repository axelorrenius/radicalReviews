import {
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { User } from "./user.entity"
import { Post } from "./post.entity"
import { Course } from "./course.entity"

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
    posts!: Post[]

    @ManyToOne(() => Course)
    course!: Course
}
