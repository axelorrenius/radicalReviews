import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react"
import { AuthenticatedUser } from "../api/api"

interface AuthContextType {
    authenticatedUser: AuthenticatedUser | null
    sessionToken: string | null
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

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                authenticatedUser,
                sessionToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
