import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Course } from "./school.entity";


@Entity()
export class Thread {
    @PrimaryKey()
    threadId!: number;

    @PrimaryKey()
    title!: string;

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne()
    createdBy!: User;

    @ManyToOne()
    updatedBy!: User;

    @OneToMany(() => Post, post => post.thread)
    posts!: Post[];

    @ManyToOne()
    course!: Course;
}

@Entity()
export class Post {
    @PrimaryKey()
    postId!: number;

    @Property()
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
    updatedBy!: User;

    @ManyToOne()
    thread!: Thread;
}