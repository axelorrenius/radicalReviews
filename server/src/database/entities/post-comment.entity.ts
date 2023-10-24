import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Post } from "./post.entity"
import { User } from "./user.entity"

@Entity()
export class Comment {
    @PrimaryKey()
    id!: number

    @Property({ type: "text" })
    content!: string

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne(() => User)
    createdBy!: User

    @ManyToOne(() => Post)
    post!: Post
}
