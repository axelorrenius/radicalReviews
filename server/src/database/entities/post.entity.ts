import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { User } from "./user.entity"
import { Thread } from "./thread.entity"
import { Comment } from "./post-comment.entity"

@Entity()
export class Post {
    @PrimaryKey()
    id!: number

    @Property({ type: "text" })
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

    @ManyToOne(() => Thread)
    thread!: Thread

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Collection<Comment> = new Collection<Comment>(this)
}
