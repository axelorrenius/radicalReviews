import { createContext, useContext, useState, ReactNode } from "react"
import { AuthenticatedUser, InternalAPI, SchoolDTO } from "../api/api"

interface AuthContextType {
    authenticatedUser: AuthenticatedUser | null
    sessionToken: string | null
    selectedSchool: SchoolDTO | null
    setSchool: (school: SchoolDTO) => void
    login: (user: AuthenticatedUser, token: string) => void
    logout: () => void
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

    const [sessionToken, setSessionToken] = useState<string | null>(
        localStorage.getItem("sessionToken")
    )

    const [selectedSchool, setSelectedSchool] = useState<SchoolDTO | null>(
        localStorage.getItem("selectedSchool")
            ? JSON.parse(localStorage.getItem("selectedSchool") || "")
            : null
    )

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

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                setSchool,
                selectedSchool,
                authenticatedUser,
                sessionToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
