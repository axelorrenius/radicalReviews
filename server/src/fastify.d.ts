export interface UserTokenValues {
    id: number
    username: string
    email: string
}
type RequestUser = UserTokenValues

declare module "fastify" {
    export interface FastifyRequest {
        user: RequestUser
    }
}
