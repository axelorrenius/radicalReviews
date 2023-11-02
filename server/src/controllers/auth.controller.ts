import { EntityManager } from "@mikro-orm/postgresql"
import { User } from "../database/entities/user.entity"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { UserTokenValues } from "../fastify"

export class AuthController {
    constructor(private em: EntityManager) {}

    private get secret() {
        return process.env.SECRET as string
    }

    public async getUserByUsername(email: string) {
        return await this.em.findOne(User, { email })
    }

    public async createUser(email: string, password: string) {}

    private async hashPassword(password: string) {
        return await bcrypt.hash(password.trim(), 10)
    }

    private createToken(user: User) {
        const userValues = {
            id: user.id,
            username: user.username,
            email: user.email
        }

        return jwt.sign(userValues, this.secret, { expiresIn: "72h" })
    }

    public verifyToken(token: string): UserTokenValues | null {
        try {
            return jwt.verify(token, this.secret) as UserTokenValues
        } catch (err) {
            return null
        }
    }

    public async login(username: string, passwordIn: string) {
        const user = await this.getUserByUsername(username)
        if (!user) {
            return
        }
        const { password } = user
        const isPasswordCorrect = await bcrypt.compare(
            passwordIn.trim(),
            password
        )
        if (isPasswordCorrect) {
            return {
                token: this.createToken(user),
                success: true
            }
        }

        return { success: false }
    }

    public async register(data: {
        email: string
        password: string
        username: string
        programDescription?: string
        description?: string
        schoolId?: number
        phoneNumber?: string
    }) {
        const { email, password, username, programDescription, description } =
            data

        if (!email || !password || !username) {
            return {
                reason: "Missing required fields",
                success: false
            }
        }

        const existingUser = await this.em.findOne(User, {
            $or: [{ email }, { username }]
        })
        if (existingUser) {
            return {
                reason: "Username is taken",
                success: false
            }
        }

        const encryptedPassword = await this.hashPassword(password)
        const user = this.em.create(User, {
            ...new User(),
            email,
            password: encryptedPassword,
            username,
            programDescription,
            description
        })
        await this.em.persistAndFlush(user)
        const token = this.createToken(user)

        return {
            token,
            success: true
        }
    }
}
