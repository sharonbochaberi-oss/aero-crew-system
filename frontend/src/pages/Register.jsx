import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Register() {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("pilot")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        if (!fullName || !email || !password || !role) {
            setError("Please fill all fields")
            return
        }

        try {
            setLoading(true)

            const response = await api.post("/auth/register", {
                full_name: fullName,
                email,
                password,
                role
            })

            setSuccess(response.data.message || "Registration successful")

            setTimeout(() => {
                navigate("/login")
            }, 1500)

        } catch (err) {
            console.error(err)

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Registration failed. Check backend server."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                ACMS Registration
                            </h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Role
                                    </label>

                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                    >
                                        <option value="admin">
                                            Admin
                                        </option>

                                        <option value="pilot">
                                            Pilot
                                        </option>

                                        <option value="flight_attendant">
                                            Flight Attendant
                                        </option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Registering..."
                                        : "Register"}
                                </button>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register