import { Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { InternalAPI } from "../api/api"
import { useAuth } from "./authContext"
import { useState } from "react"

type LoginModalProps = {
    show: boolean
    onClose: () => void
}
const server = new InternalAPI()

function LoginModal(props: LoginModalProps) {
    const { login } = useAuth()
    const { show, onClose } = props
    const [errorState, setErrorState] = useState({ success: true, message: "" })

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            username: { value: string }
            password: { value: string }
        }
        setErrorState({ success: true, message: "" })
        server
            .login({
                username: target.username.value,
                password: target.password.value
            })
            .then((res) => {
                if (res.success && res.token) {
                    login(res.user, res.token)
                    onClose()
                } else {
                    setErrorState({
                        success: false,
                        message: res.reason || "Unknown error"
                    })
                }
            })
    }

    return (
        <Modal show={show} onHide={() => onClose()}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Link
                        onClick={() => onClose()}
                        to="/register"
                        className="btn btn-outline-dark px-4"
                    >
                        Not a member? Register here!
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
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
                    <div>
                        <p className="text-danger">{errorState.message}</p>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => null}
                    >
                        Login
                    </button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => onClose()}>
                    Close
                </button>
                {/* You can add a "Submit" button if needed */}
            </Modal.Footer>
        </Modal>
    )
}

export default LoginModal
