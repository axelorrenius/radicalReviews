import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { School } from "./school.entity"
import { UserCourse } from "./user-course.entity"
import { Post } from "./post.entity"
import { Comment } from "./post-comment.entity"
import { Thread } from "./thread.entity"

@Entity()
export class User {
    @PrimaryKey()
    id!: number

    @Property()
    username!: string

    @Property()
    email!: string

    @Property({ nullable: true })
    phoneNumber?: string

    @Property()
    password!: string

    @Property({ default: 0 })
    experience!: number

    @Property({ nullable: true })
    programDescription?: string

    @Property({ nullable: true })
    description?: string

    @Property({ onCreate: () => new Date() })
    createdAt!: Date

    @Property({ onUpdate: () => new Date(), nullable: true })
    updatedAt: Date = new Date()

    @ManyToOne(() => School, { nullable: true })
    school?: School

    @OneToMany(() => UserCourse, (userCourse) => userCourse.user)
    userCourses!: Collection<UserCourse>

    @OneToMany(() => Thread, (thread) => thread.createdBy)
    threads!: Collection<Thread>

    @OneToMany(() => Post, (post) => post.createdBy)
    posts!: Collection<Post>

    @OneToMany(() => Comment, (post) => post.createdBy)
    comments!: Collection<Comment>
}
