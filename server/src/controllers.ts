import { AuthController } from "./controllers/auth.controller"
import { CourseController } from "./controllers/course.controller"
import { initORM } from "./database/db"

let controllers: {
    courseController: CourseController
    authController: AuthController
} | null = null

export async function initControllers() {
    if (!controllers) {
        const db = await initORM()

        controllers = {
            courseController: new CourseController(db.em),
            authController: new AuthController(db.em)
        }
    }
}

export { controllers }
