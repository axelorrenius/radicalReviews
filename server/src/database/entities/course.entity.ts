import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { Thread } from "./thread.entity"
import { School } from "./school.entity"
import { CourseInstance } from "./course-instance.entity"

@Entity()
export class Course {
    @PrimaryKey()
    id!: number // ska nog va en string tex ME2004

    @Property()
    courseName!: string

    @Property()
    courseCode!: string

    @Property()
    description!: string

    @ManyToOne(() => School)
    school!: School

    @OneToMany(() => Thread, (thread) => thread.course)
    threads: Collection<Thread> = new Collection<Thread>(this)

    @OneToMany(() => CourseInstance, (courseInstance) => courseInstance.course)
    courseInstances: Collection<CourseInstance> =
        new Collection<CourseInstance>(this)

    tags?: string[]
}
