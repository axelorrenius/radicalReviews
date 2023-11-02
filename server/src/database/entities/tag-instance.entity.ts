import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Tag } from "./tag.entity"

@Entity()
export class TagInstance {
    @PrimaryKey()
    id!: number

    @Property()
    entityId!: number

    @ManyToOne(() => Tag)
    tag!: Tag

    constructor(entityId: number, tag: Tag) {
        this.entityId = entityId
        this.tag = tag
    }
}
