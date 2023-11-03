import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
    types
} from "@mikro-orm/core"
import { Thread } from "./thread.entity"
import { School } from "./school.entity"
import { CourseInstance } from "./course-instance.entity"

@Entity()
export class Course {
    @PrimaryKey()
    id!: number

    @Property()
    courseName!: string

    @Property()
    courseCode!: string

    @Property({ type: types.text })
    description!: string

    @ManyToOne(() => School)
    school!: School

    @OneToMany(() => CourseInstance, (courseInstance) => courseInstance.course)
    courseInstances!: Collection<CourseInstance>

    public tags?: string[]
}
