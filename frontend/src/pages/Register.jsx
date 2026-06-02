import { useState } from "react"

import api from "../services/api"

function Register() {

    const [fullName, setFullName] = useState("")

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [role, setRole] = useState("pilot")

    const handleRegister = async () => {

        try {

            await api.post(
                "/auth/register",
                {
                    full_name: fullName,
                    email,
                    password,
                    role
                }
            )

            alert("Registration successful")

        } catch (error) {

            alert("Registration failed")
        }
    }

    return (

        <div>

            <h1>Register</h1>

            <input
                type="text"
                placeholder="Full Name"
                onChange={(e) =>
                    setFullName(e.target.value)
                }
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br /><br />

            <select
                onChange={(e) =>
                    setRole(e.target.value)
                }
            >

                <option value="pilot">
                    Pilot
                </option>

                <option value="flight_attendant">
                    Flight Attendant
                </option>

                <option value="admin">
                    Admin
                </option>

            </select>

            <br /><br />

            <button onClick={handleRegister}>
                Register
            </button>

        </div>
    )
}

export default Register