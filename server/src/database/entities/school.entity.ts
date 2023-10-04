import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Thread } from "./forum.entity";
import { User, UserCourse } from "./user.entity";


@Entity()
export class School {
    @PrimaryKey()
    schoolId!: number;

    @Property()
    schoolName!: string;

    @Property()
    description!: string;

    @OneToMany(() => Course, course => course.school)
    courses!: Course[];

    @OneToMany(() => User, user => user.school)
    users!: User[];
}


@Entity()
export class Course {
    @PrimaryKey()
    courseId!: number;

    @Property()
    courseName!: string;

    @Property()
    description!: string;

    @ManyToOne()
    school!: School;

    @OneToMany(() => Thread, thread => thread.course)
    threads!: Thread[];

    @OneToMany(() => UserCourse, userCourse => userCourse.course)
    userCourses!: UserCourse[];
}