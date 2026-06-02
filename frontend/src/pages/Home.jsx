import { Link } from "react-router-dom"

function Home() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    <h1 className="display-5 mb-3">Aero Crew Management System</h1>
                    <p className="lead mb-4">
                        Manage aircraft, flights, crew assignments, and operational reports from a secure portal.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-outline-secondary btn-lg">
                            Register
                        </Link>
                    </div>
                    <div className="mt-5 text-start">
                        <h3>Key features</h3>
                        <ul>
                            <li>JWT-protected dashboard and CRUD endpoints</li>
                            <li>Flight and aircraft management</li>
                            <li>Crew assignment and reporting workflows</li>
                            <li>Role-aware UI for admins, pilots, and cabin crew</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
