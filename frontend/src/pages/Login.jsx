import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            )

            localStorage.setItem(
                "token",
                 response.data.token
            )

            localStorage.setItem(
                "user",
                 JSON.stringify(response.data.user)
            )

            localStorage.setItem(
                "user_role",
                 response.data.user.role
            )

            login(response.data.user)

            navigate("/dashboard")

        } catch (err) {

            setError(
                err.response?.data?.error ||
                "Login failed"
            )
        }
    }

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                ACMS Login
                            </h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>Password</label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                >
                                    Login
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default LoginPage