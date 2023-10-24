import { MikroORM } from "@mikro-orm/core"
import { AbstractSqlDriver, EntityManager } from "@mikro-orm/postgresql"

export interface DBCache {
    orm: MikroORM
    em: EntityManager
}

let cache: DBCache

export async function initORM(): Promise<DBCache> {
    if (cache) {
        return cache
    }

    // config is provided by default
    try {
        const orm = await MikroORM.init<AbstractSqlDriver>()
        // save to cache before returning
        return (cache = {
            orm,
            em: orm.em
        })
    } catch (err) {
        console.error(err)
        return {
            orm: null as any,
            em: null as any
        }
    }
}
