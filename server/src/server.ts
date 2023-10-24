import { build } from "./app"
import dotenv from "dotenv"
;(async () => {
    dotenv.config()

    const app = await build({ logger: true })

    app.listen(
        { host: "0.0.0.0", port: process.env.PORT } as any,
        (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        }
    )
})()
