import { Options } from "@mikro-orm/core"
import dotenv from "dotenv"
dotenv.config()

console.log(process.env.PG_HOST)
console.log(process.env.PG_USER)
console.log(process.env.PG_PASSWORD)
console.log(process.env.PG_DATABASE)

const config: Options = {
    migrations: {
        pathTs: "src/database/migrations",
        path: "dist/database/migrations",
        tableName: "mikro-orm-migrations",
        transactional: true
    },
    entitiesTs: ["src/**/*.entity.ts"],
    entities: ["dist/**/*.entity.js"],
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: 5432,
    dbName: process.env.PG_DATABASE,
    type: "postgresql",
    debug: true,
    driverOptions: {
        connection: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
}

export default config
