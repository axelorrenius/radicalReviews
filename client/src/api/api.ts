export interface SchoolDTO {
    id: number
    schoolName: string
    description: string
    location?: string
    imageUrl?: string
}

export interface CourseInstanceDTO {
    id?: number
    courseId: number
    course?: CourseDTO
    roundName: string
    roundStart: Date
    roundEnd: Date
    examDate?: Date
}

export interface CourseDTO {
    id?: number
    courseCode: string
    courseName: string
    description: string
    schoolId: number
    tags?: string[]
    courseInstances?: CourseInstanceDTO[]
}

export interface SearchDTO {
    query: string
    schoolId: number
}

export interface QueryResult {
    entityType: string
    entityId: number
    description: string
}

export interface ThreadDTO {
    id?: number
    courseId: number
    title: string
    upVotes: number
    downVotes: number
    content: string
    createdAt: Date
    updatedAt?: Date
    posts: PostDTO[]
    tags: string[]
    courseRound?: string
}

export interface PostDTO {
    id?: number
    user: userDTO
    threadId: number
    content: string
    upVotes: number
    downVotes: number
    createdAt?: Date
    updatedAt?: Date
    comments: CommentDTO[]
}

export interface userDTO {
    id: number
    username: string
    lvl: number
    title: string
    email?: string
    password?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface CommentDTO {
    id: number
    postId: number
    content: string
    createdAt: Date
    updatedAt: Date
}

export interface AuthenticatedUser {
    id: number
    username: string
    email: string
}

export interface AuthResponse {
    user: AuthenticatedUser
    token?: string
    reason?: string
    success: boolean
}

export interface CourseResponse {
    course?: CourseDTO
    reason?: string
    success: boolean
}

export class InternalAPI {
    private endpoint = ""
    private schools = "/api/schools"
    private courses = "/api/courses"
    private threads = "/api/threads"
    private user = "/api/user"
    private auth = "/api/auth"

    constructor() {}

    get authToken() {
        return localStorage.getItem("sessionToken")
    }

    public async post<T, U>(endpoint: string, body: T): Promise<U> {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.authToken || ""
            },
            body: JSON.stringify(body)
        })

        try {
            return response.json()
        } catch (err) {
            return {} as U
        }
    }

    public async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(endpoint, {
            headers: {
                Authorization: "Bearer " + this.authToken || ""
            }
        })
        return response.json()
    }

    public async register(values: {
        email: string
        username: string
        password: string
    }): Promise<AuthResponse> {
        return await this.post(this.endpoint + this.auth + "/register", values)
    }

    public async login(values: {
        username: string
        password: string
    }): Promise<AuthResponse> {
        return await this.post(this.endpoint + this.auth + "/login", values)
    }

    public async saveCourse(dto: CourseDTO): Promise<CourseResponse> {
        return await this.post(this.endpoint + this.courses, dto)
    }

    public async saveCourseInstance(
        dto: CourseInstanceDTO
    ): Promise<CourseInstanceDTO> {
        return await this.post(
            this.endpoint + this.courses + "/" + dto.courseId + "/instance",
            dto
        )
    }

    public async search(search: SearchDTO): Promise<QueryResult[]> {
        return await this.post<SearchDTO, QueryResult[]>(
            this.endpoint + this.courses + "/search",
            search
        )
    }

    public async getCourses(schoolId: number): Promise<CourseDTO[]> {
        return await this.get<CourseDTO[]>(
            this.endpoint + this.courses + "/by-school/" + schoolId
        )
    }

    public async getCourse(id: number): Promise<CourseDTO> {
        return await this.get<CourseDTO>(
            this.endpoint + this.courses + "/" + id
        )
    }

    public async saveThread(dto: {
        id?: number
        courseInstanceId: number
        title: string
        content: string
        tags?: string[]
    }): Promise<ThreadDTO> {
        return await this.post(this.endpoint + this.threads, dto)
    }
    public async getThreads(
        courseId: number,
        courseInstanceId?: number
    ): Promise<ThreadDTO[]> {
        return await this.get<ThreadDTO[]>(
            this.endpoint +
                this.courses +
                "/" +
                courseId +
                "/threads" +
                "?courseInstanceId=" +
                courseInstanceId || "0"
        )
    }
    public async getThread(threadId: number): Promise<ThreadDTO> {
        return await this.get<ThreadDTO>(
            this.endpoint + this.threads + "/" + threadId
        )
    }

    public async upVoteThread(threadId: number): Promise<void> {
        await this.post(
            `${this.endpoint}${this.threads}/${threadId}/upvote`,
            {}
        )
    }

    public async downVoteThread(threadId: number): Promise<void> {
        await this.post(
            `${this.endpoint}${this.threads}/${threadId}/downvote`,
            {}
        )
    }

    public async savePost(dto: {
        id?: number
        content: string
        threadId: number
    }): Promise<PostDTO> {
        return await this.post(
            `${this.endpoint}${this.threads}/${dto.threadId}/posts`,
            dto
        )
    }

    public async upVotePost(threadId: number, postId: number): Promise<void> {
        await this.post(
            `${this.endpoint}${this.threads}/${threadId}/posts/${postId}/upvote`,
            {}
        )
    }

    public async downVotePost(threadId: number, postId: number): Promise<void> {
        await this.post(
            `${this.endpoint}${this.threads}/${threadId}/posts/${postId}/downvote`,
            {}
        )
    }

    public async getSchools(): Promise<SchoolDTO[]> {
        return await this.get<SchoolDTO[]>(this.endpoint + this.schools)
    }

    public async saveSchool(dto: SchoolDTO): Promise<SchoolDTO> {
        return await this.post(this.endpoint + this.schools, dto)
    }

    public async setPreferredSchool(schoolId: number): Promise<void> {
        return await this.post(
            this.endpoint + this.user + "/preferred-school",
            { schoolId }
        )
    }
}
