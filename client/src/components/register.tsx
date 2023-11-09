import { useState } from "react"
import { InternalAPI } from "../api/api"
import { useAuth } from "./authContext"
import SimpleModal from "./simpleModal"

const server = new InternalAPI()

function Register() {
    const { login } = useAuth()
    const [modalState, setModalState] = useState({ open: false, message: "" })
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            email: { value: string }
            username: { value: string }
            password: { value: string }
        }

        server
            .register({
                email: target.email.value,
                username: target.username.value,
                password: target.password.value
            })
            .then((res) => {
                if (res.success && res.token) {
                    login(res.user, res.token)
                } else {
                    setModalState({
                        open: true,
                        message: res.reason || "Unknown error"
                    })
                }
            })
    }
    return (
        <div>
            <SimpleModal
                title="Registration failed"
                open={modalState.open}
                message={modalState.message}
                onClose={() => setModalState({ open: false, message: "" })}
            />
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Register
