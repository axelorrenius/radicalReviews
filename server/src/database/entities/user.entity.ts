import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Course, School } from "./school.entity";

@Entity()
export class User {
    @PrimaryKey()
    userId!: number;

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
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @ManyToOne()
    school!: School;
}

export enum CourseRole {
    Student = "student",
    TeacherAssistant = "ta",
    Teacher = "teacher",
    Professor = "professor",
    Admin = "admin"
}

@Entity()
export class UserCourse {
    @PrimaryKey()
    userCourseId!: number;

    @ManyToOne()
    user!: User;

    @ManyToOne()
    course!: Course;

    @Property()
    enrolledDate!: Date;

    @Property()
    role!: CourseRole;
}