import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Thread } from "./forum.entity";
import { School } from "./school.entity";
import { UserCourse } from "./user-course.entity";

@Entity()
export class Course {
    @PrimaryKey()
    id!: number; // ska nog va en string tex ME2004

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