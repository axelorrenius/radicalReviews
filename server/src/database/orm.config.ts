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
    host: "radicalreviews-2.cmm29ljdrxgc.eu-west-1.rds.amazonaws.com",
    user: "postgres",
    password: "Postgres123",
    port: 5432,
    dbName: "radicalreviews",
    type: "postgresql",
    driverOptions: {
        connection: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
}

export default config
