import { createContext, useContext, useState, ReactNode } from "react"
import { AuthenticatedUser, CourseDTO, InternalAPI, SchoolDTO } from "../api/api"

interface AuthContextType {
    authenticatedUser: AuthenticatedUser | null
    sessionToken: string | null
    selectedSchool: SchoolDTO | null
    selectedCourse: CourseDTO | null
    toasts: Toast[]
    addToast: (toast: Toast) => void
    setSchool: (school: SchoolDTO) => void
    setCourse: (course: CourseDTO | null) => void
    login: (user: AuthenticatedUser, token: string) => void
    logout: () => void
}

interface Toast {
    experience: number,
    delay?: number,
    id?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

const server = new InternalAPI()

export function AuthProvider({ children }: AuthProviderProps) {
    const [authenticatedUser, setAuthenticatedUser] =
        useState<AuthenticatedUser | null>(
            // Initialize with the value from localStorage, if available
            localStorage.getItem("authenticatedUser")
                ? JSON.parse(localStorage.getItem("authenticatedUser") || "")
                : null
        )

    const [toasts, setToasts] = useState<Toast[]>([])

    const [sessionToken, setSessionToken] = useState<string | null>(
        localStorage.getItem("sessionToken")
    )

    const [selectedSchool, setSelectedSchool] = useState<SchoolDTO | null>(
        localStorage.getItem("selectedSchool")
            ? JSON.parse(localStorage.getItem("selectedSchool") || "")
            : null
    )

    const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null)

    const addToast = (toast: Toast) => {
        setTimeout(() => {

            toast.id = toasts.length + 1
            toast.delay = 5000
            setToasts([...toasts, toast])
            setTimeout(() => {
                const newToasts = toasts.filter((t) => t.id !== toast.id)
                setToasts(newToasts)
            }, toast.delay)
        }, 100)
    }

    const login = (user: AuthenticatedUser, token: string) => {
        localStorage.setItem("authenticatedUser", JSON.stringify(user))
        localStorage.setItem("sessionToken", token)
        setAuthenticatedUser(user)
        setSessionToken(token)
    }

    const logout = () => {
        localStorage.removeItem("authenticatedUser")
        localStorage.removeItem("sessionToken")
        setAuthenticatedUser(null)
        setSessionToken("")
    }

    const setSchool = (school: SchoolDTO) => {
        if (!school || !school.id) return
        localStorage.setItem("selectedSchool", JSON.stringify(school))
        setSelectedSchool(school)
        if (authenticatedUser && authenticatedUser.id)
            server.setPreferredSchool(school.id).then(() => console.log("done"))
    }

    const setCourse = (course: CourseDTO | null) => {
        setSelectedCourse(course)
    }

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                setSchool,
                setCourse,
                addToast,
                toasts,
                selectedSchool,
                selectedCourse,
                authenticatedUser,
                sessionToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
