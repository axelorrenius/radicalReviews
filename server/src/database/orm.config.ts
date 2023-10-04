import { Options } from "@mikro-orm/core"

const config: Options = {
    migrations: {
        path: "./src/database/migrations",
        tableName: "migrations",
        transactional: true
    },
    entitiesTs: ["./src/database/entities"],
    entities: ["./dist/database/entities"],
    host: process.env.PG_HOST || "localhost",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "postgres",
    port: 5432,
    dbName: "radicalreviews",
    type: "postgresql",
    debug: true
}

export default config
