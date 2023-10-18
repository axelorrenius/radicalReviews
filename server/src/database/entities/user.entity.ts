import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { School } from "./school.entity";
import { UserCourse } from "./user-course.entity";
import { Post } from "./post.entity";
import { Comment } from "./post-comment.entity";

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    username!: string;

    @Property()
    email!: string;

    @Property()
    phoneNumber!: string;

    @Property()
    password!: string;

    @Property()
    salt!: string;

    @Property()
    programDescription!: string;

    @Property({ onCreate: () => new Date() })
    createdAt!: Date;

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne()
    school!: School;

    @OneToMany(() => UserCourse, userCourse => userCourse.user)
    userCourses!: UserCourse[];

    @OneToMany(() => Post, post => post.createdBy)
    posts!: Post[];

    @OneToMany(() => Comment, post => post.createdBy)
    comments!: Comment[];
}
