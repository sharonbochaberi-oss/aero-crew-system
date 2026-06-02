import { useNavigate } from "react-router-dom"

function Navbar() {

    const navigate = useNavigate()

    const logout = () => {

        localStorage.removeItem("token")

        navigate("/login")
    }

    return (

        <div
            style={{
                background: "black",
                color: "white",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between"
            }}
        >

            <h2>ACMS</h2>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    )
}

export default Navbar