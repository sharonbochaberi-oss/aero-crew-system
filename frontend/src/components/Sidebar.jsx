import { Link } from "react-router-dom"

function Sidebar() {

    return (

        <div
            style={{
                width: "200px",
                background: "#f4f4f4",
                minHeight: "100vh",
                padding: "20px"
            }}
        >

            <h3>Menu</h3>

            <ul>

                <li>
                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/flights">
                        Flights
                    </Link>
                </li>

                <li>
                    <Link to="/aircraft">
                        Aircraft
                    </Link>
                </li>

                <li>
                    <Link to="/crew">
                        Crew
                    </Link>
                </li>

                <li>
                    <Link to="/reports">
                        Reports
                    </Link>
                </li>

            </ul>

        </div>
    )
}

export default Sidebar