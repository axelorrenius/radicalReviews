import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Post } from "./post.entity";
import { Course } from "./course.entity";

@Entity()
export class Thread {
    @PrimaryKey()
    id!: number;

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
