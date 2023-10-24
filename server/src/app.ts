import fastify, { FastifyInstance } from "fastify"
import { RequestContext } from "@mikro-orm/core"
import { initORM } from "./database/db"
import { initControllers } from "./controllers"
import courseRoutes from "./routes/course.route"
import schoolRoutes from "./routes/school.route"
import { nextTick } from "process"
import threadRoutes from "./routes/thread.route"

export const build = async (opts: {}) => {
    const db = await initORM()

    const app = fastify(opts)
    await initControllers()

    app.options("/*", async (request, reply) => {
        reply.code(200)
    })

    app.addHook("onRequest", async (request, reply) => {
        // await parseToken(cp.AuthController)(request, reply)
    })

    app.addHook("onRequest", (req, res, next) => {
        /**
         * Creates an isolated fork of the entity manager for each request,
         * enabling concurrent isolated entity manager instances
         */
        RequestContext.create(db.orm.em, next)
    })

    app.addHook("preHandler", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, X-Auth-Token"
        )
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        )
        next()
    })

    app.addHook("onClose", async () => {
        await db.orm.close()
    })
    registerDecorators(app)
    registerRoutes(app)
    app.log.debug("Test")

    return app
}

const registerDecorators = (app: FastifyInstance) => {
    // app.decorate("authenticate", authenticate(app.log))
}

const registerRoutes = (app: FastifyInstance) => {
    app.get("/healthcheck", async (request, reply) => {
        {
            reply.send("OK")
        }
    })
    app.register(courseRoutes, {
        prefix: "/api/courses"
    })
    app.register(schoolRoutes, {
        prefix: "/api/schools"
    })
    app.register(threadRoutes, {
        prefix: "/api/threads"
    })
}
