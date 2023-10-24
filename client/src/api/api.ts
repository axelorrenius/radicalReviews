import { Course } from "./models/course.model"

export interface SchoolDTO {
    id: number
    schoolName: string
    description: string
}

export interface CourseDTO {
    id: number
    courseName: string
    description: string
    schoolId: number
}

export interface SearchCourseDTO {
    query: string
    schoolId: number
}

export interface ThreadDTO {
    id?: number
    courseId: number
    title: string
    upVotes: number
    downVotes: number
    content: string
    createdAt?: Date
    updatedAt?: Date
    posts: PostDTO[]
}

export interface PostDTO {
    id?: number
    threadId: number
    content: string
    upVotes: number
    downVotes: number
    createdAt?: Date
    updatedAt?: Date
    comments: CommentDTO[]
}

export interface CommentDTO {
    id: number
    postId: number
    content: string
    createdAt: Date
    updatedAt: Date
}


export class InternalAPI {
    private endpoint = "http://localhost:8080";
    private schools = "/api/schools";
    private courses = "/api/courses";
    private threads = "/api/threads";

    constructor() {
    }

    public async post<T, U> (endpoint: string, body: T): Promise<U> {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        return response.json();
    }

    public async get<T> (endpoint: string): Promise<T> {
        const response = await fetch(endpoint);
        return response.json();
    }


    public async saveCourse(dto: CourseDTO): Promise<CourseDTO> {
        return await this.post(this.endpoint + this.courses, dto);
    }

    public async searchCourse(search: SearchCourseDTO): Promise<CourseDTO[]> {
        return await this.post<SearchCourseDTO, CourseDTO[]>(this.endpoint + this.courses, search);
    }

    public async getCourses(schoolId: number): Promise<CourseDTO[]> {
        console.log(this.endpoint + this.courses + "/bySchool/" + schoolId)
        return await this.get<CourseDTO[]>(this.endpoint + this.courses + "/bySchool/" + schoolId);
    }

    public async getCourse(id: number): Promise<CourseDTO> {
        return await this.get<CourseDTO>(this.endpoint + this.courses + "/" + id);
    }


    public async saveThread(dto: ThreadDTO): Promise<ThreadDTO> {
        return await this.post(this.endpoint + this.threads, dto);
    }
    public async getThreads(courseId: number): Promise<ThreadDTO[]> {
        return await this.get<ThreadDTO[]>(this.endpoint + this.courses + "/" + courseId + "/threads");
    }
    public async getThread(threadId: number): Promise<ThreadDTO> {
        return await this.get<ThreadDTO>(this.endpoint + this.threads + "/" + threadId);
    }




    public async upVoteThread(threadId: number): Promise<void> {
        await this.post(`${this.endpoint}${this.threads}/${threadId}/upvote`, {})
    }


    public async downVoteThread(threadId: number): Promise<void> {
        await this.post(`${this.endpoint}${this.threads}/${threadId}/downvote`, {})
    }

    public async savePost(dto: PostDTO): Promise<PostDTO> {
        return await this.post(`${this.endpoint}${this.threads}/${dto.threadId}/posts`, dto);
    }

    public async upVotePost(threadId: number, postId: number): Promise<void> {
        await this.post(`${this.endpoint}${this.threads}/${threadId}/posts/${postId}/upvote`, {})
    }

    public async downVotePost(threadId: number, postId: number): Promise<void> {
        await this.post(`${this.endpoint}${this.threads}/${threadId}/posts/${postId}/downvote`, {})
    }

    public async saveSchool(dto: SchoolDTO): Promise<SchoolDTO> {
        return await this.post(this.endpoint + this.schools, dto);
    }
}