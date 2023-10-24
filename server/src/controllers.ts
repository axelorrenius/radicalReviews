import { CourseController } from "./controllers/course.controller"
import { initORM } from "./database/db"

let controllers: {
    courseController: CourseController
} | null = null

export async function initControllers() {
    if (!controllers) {
        const db = await initORM()

        controllers = {
            courseController: new CourseController(db.em)
        }
    }
}

export { controllers }
