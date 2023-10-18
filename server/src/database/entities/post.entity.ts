import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Thread } from "./forum.entity";
import { Comment } from "./post-comment.entity";

@Entity()
export class Post {
    @PrimaryKey()
    id!: number;

    @Property({type: "text"})
    content!: string;

    @Property({default: 0})
    upVotes!: number;

    @Property({default: 0})
    downVotes!: number;

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne()
    createdBy!: User;

    @ManyToOne()
    thread!: Thread;

    @OneToMany(() => Comment, comment => comment.post)
    comments!: Comment[];
}