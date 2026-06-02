import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"

function Crew() {
    // Dropdown/Data population lists
    const [assignments, setAssignments] = useState([])
    const [users, setUsers] = useState([])

    // Input States
    const [userId, setUserId] = useState("")
    const [flightId, setFlightId] = useState("")

    const fetchCrewData = async () => {
        try {
            // Note: Update '/users/' route if your user listing endpoint differs
            const [assignmentsRes, usersRes] = await Promise.all([
                api.get("/crew/assignments/"),
                api.get("/auth/users/")
            ])
            setAssignments(assignmentsRes.data)
            setUsers(usersRes.data)
        } catch (error) {
            console.error("Error fetching crew data:", error)
        }
    }

    useEffect(() => {
        fetchCrewData()
    }, [])

    const assignCrew = async () => {
        if (!userId || !flightId) {
            return alert("Please select both a crew member and a flight.")
        }

        try {
            await api.post("/crew/assign/", {
                user_id: parseInt(userId, 10),
                flight_id: parseInt(flightId, 10)
            })
            setUserId("")
            setFlightId("")
            fetchCrewData()
        } catch (error) {
            console.error("Error assigning crew:", error)
        }
    }

    const removeCrew = async (fId, uId) => {
        if (window.confirm("Remove this crew member from the flight?")) {
            try {
                await api.post("/crew/remove/", {
                    flight_id: fId,
                    user_id: uId
                })
                fetchCrewData()
            } catch (error) {
                console.error("Error removing crew member:", error)
            }
        }
    }

    return (
        <DashboardLayout>
            <h1>Crew Assignment</h1>

            {/* ASSIGNMENT FORM */}
            <div style={{ marginBottom: "25px" }}>
                <h3>Assign Personnel</h3>
                
                <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                    <option value="">Select Crew Member</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.full_name} ({user.role || "Crew"})
                        </option>
                    ))}
                </select>
                
                <br /><br />

                <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                    <option value="">Select Flight Destination</option>
                    {assignments.map((f) => (
                        <option key={f.flight_id} value={f.flight_id}>
                            Flight {f.flight_number} ({f.origin} → {f.destination})
                        </option>
                    ))}
                </select>

                <br /><br />
                <button onClick={assignCrew}>Assign to Flight</button>
            </div>

            <hr />

            {/* ASSIGNMENTS VIEW LIST */}
            <h3>Flight Manifests</h3>
            <div>
                {assignments.map((flight) => (
                    <div key={flight.flight_id} style={{ borderBottom: "1px solid #ccc", padding: "15px 0" }}>
                        <h4>Flight {flight.flight_number}: {flight.origin} → {flight.destination}</h4>
                        
                        <h5>Assigned Crew:</h5>
                        {flight.crew.length === 0 ? (
                            <p style={{ color: "gray", fontStyle: "italic" }}>No crew assigned to this flight yet.</p>
                        ) : (
                            <ul>
                                {flight.crew.map((member) => (
                                    <li key={member.id} style={{ marginBottom: "5px" }}>
                                        <strong>{member.full_name}</strong> — {member.role}
                                        <button 
                                            onClick={() => removeCrew(flight.flight_id, member.id)}
                                            style={{ marginLeft: "15px", color: "red", padding: "2px 6px" }}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Crew