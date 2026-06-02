import { useAuth } from "../context/AuthContext"
import DashboardLayout from "../layouts/DashboardLayout"

function AdminDashboard() {
    return (
        <div>
            <h2>Admin Control Center</h2>

            <ul>
                <li>Manage Flights</li>
                <li>Manage Aircraft</li>
                <li>Manage Crew Assignments</li>
                <li>View Reports</li>
            </ul>
        </div>
    )
}

function PilotDashboard() {
    return (
        <div>
            <h2>Pilot Flight Deck</h2>

            <ul>
                <li>View Assigned Flights</li>
                <li>Submit Flight Reports</li>
            </ul>
        </div>
    )
}

function CabinCrewDashboard() {
    return (
        <div>
            <h2>Cabin Crew Portal</h2>

            <ul>
                <li>View Flight Assignments</li>
                <li>Submit Cabin Reports</li>
            </ul>
        </div>
    )
}

function Dashboard() {
    const { user } = useAuth()

    if (!user) {
        return (
            <DashboardLayout>
                <h3>Please login first</h3>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>

            <h1>
                Welcome, {user.full_name}
            </h1>

            <p>
                Role: {user.role}
            </p>

            <hr />

            {user.role === "admin" &&
                <AdminDashboard />
            }

            {user.role === "pilot" &&
                <PilotDashboard />
            }

            {user.role === "flight_attendant" &&
                <CabinCrewDashboard />
            }

        </DashboardLayout>
    )
}

export default Dashboard