import { EntityManager, MikroORM } from "@mikro-orm/core"

export interface Services {
    orm: MikroORM
    em: EntityManager
}

let cache: Services

export async function initORM(): Promise<Services> {
    if (cache) {
        return cache
    }

    // config is provided by default
    const orm = await MikroORM.init()

    // save to cache before returning
    return (cache = {
        orm,
        em: orm.em
    })
}
