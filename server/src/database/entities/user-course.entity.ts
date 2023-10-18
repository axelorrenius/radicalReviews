import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Course } from "./course.entity";
import { CourseRole } from "../enums";

@Entity()
export class UserCourse {
    @PrimaryKey()
    id!: number;

    @ManyToOne()
    user!: User;

    @ManyToOne()
    course!: Course;

    @Property()
    enrolledDate!: Date;

    @Property()
    role!: CourseRole;
}