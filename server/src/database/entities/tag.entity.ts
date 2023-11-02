import {
    Collection,
    Entity,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/core"
import { EntityType } from "../enums"
import { TagInstance } from "./tag-instance.entity"

@Entity()
export class Tag {
    @PrimaryKey()
    id!: number

    @Property()
    name!: string

    @Property()
    entityType!: EntityType

    @OneToMany(() => TagInstance, (tagInstance) => tagInstance.tag)
    tagInstances: Collection<TagInstance> = new Collection<TagInstance>(this)

    constructor(name: string, entityType: EntityType) {
        this.name = name
        this.entityType = entityType
    }
}
