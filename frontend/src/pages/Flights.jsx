import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"

function Flights() {
    // List states
    const [flights, setFlights] = useState([])
    const [aircraftFleet, setAircraftFleet] = useState([])

    // Creation form states
    const [flightNumber, setFlightNumber] = useState("")
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [departureTime, setDepartureTime] = useState("")
    const [arrivalTime, setArrivalTime] = useState("")
    const [aircraftId, setAircraftId] = useState("")

    // Inline editing states
    const [editingId, setEditingId] = useState(null)
    const [editFlightNumber, setEditFlightNumber] = useState("")
    const [editOrigin, setEditOrigin] = useState("")
    const [editDestination, setEditDestination] = useState("")
    const [editDepartureTime, setEditDepartureTime] = useState("")
    const [editArrivalTime, setEditArrivalTime] = useState("")
    const [editAircraftId, setEditAircraftId] = useState("")

    const fetchData = async () => {
        try {
            const [flightsRes, aircraftRes] = await Promise.all([
                api.get("/flights/"),
                api.get("/aircraft/")
            ])
            setFlights(flightsRes.data)
            setAircraftFleet(aircraftRes.data)
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const createFlight = async () => {
        if (!flightNumber || !origin || !destination || !departureTime || !arrivalTime || !aircraftId) {
            return alert("Please fill out all fields.")
        }

        try {
            await api.post("/flights/", {
                flight_number: flightNumber,
                origin,
                destination,
                departure_time: departureTime,
                arrival_time: arrivalTime,
                aircraft_id: aircraftId
            })
            // Reset input values
            setFlightNumber("")
            setOrigin("")
            setDestination("")
            setDepartureTime("")
            setArrivalTime("")
            setAircraftId("")
            fetchData()
        } catch (error) {
            console.error("Error creating flight:", error)
        }
    }

    const deleteFlight = async (id) => {
        if (window.confirm("Are you sure you want to delete this flight?")) {
            try {
                await api.delete(`/flights/${id}/`)
                fetchData()
            } catch (error) {
                console.error("Error deleting flight:", error)
            }
        }
    }

    const startEditing = (flight) => {
        setEditingId(flight.id)
        setEditFlightNumber(flight.flight_number)
        setEditOrigin(flight.origin)
        setEditDestination(flight.destination)
        // Convert to format required by datetime-local input (YYYY-MM-DDTHH:MM)
        setEditDepartureTime(flight.departure_time ? flight.departure_time.substring(0, 16) : "")
        setEditArrivalTime(flight.arrival_time ? flight.arrival_time.substring(0, 16) : "")
        setEditAircraftId(flight.aircraft_id)
    }

    const saveUpdate = async (id) => {
        try {
            await api.put(`/flights/${id}/`, {
                flight_number: editFlightNumber,
                origin: editOrigin,
                destination: editDestination,
                departure_time: editDepartureTime,
                arrival_time: editArrivalTime,
                aircraft_id: editAircraftId
            })
            setEditingId(null)
            fetchData()
        } catch (error) {
            console.error("Error updating flight:", error)
        }
    }

    const formatDateTime = (isoString) => {
        if (!isoString) return "N/A"
        return new Date(isoString).toLocaleString()
    }

    return (
        <DashboardLayout>
            <h1>Flight Management</h1>

            {/* CREATE FORM */}
            <div style={{ marginBottom: "20px" }}>
                <h3>Schedule New Flight</h3>
                <input
                    placeholder="Flight Number"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                />
                <br /><br />
                <input
                    placeholder="Origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                />
                <br /><br />
                <input
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <br /><br />
                <label>Departure Time: </label>
                <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                />
                <br /><br />
                <label>Arrival Time: </label>
                <input
                    type="datetime-local"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                />
                <br /><br />
                <select value={aircraftId} onChange={(e) => setAircraftId(e.target.value)}>
                    <option value="">Select Aircraft</option>
                    {aircraftFleet.map((ac) => (
                        <option key={ac.id} value={ac.id}>
                            {ac.registration_number} ({ac.model})
                        </option>
                    ))}
                </select>
                <br /><br />
                <button onClick={createFlight}>Create Flight</button>
            </div>

            <hr />

            {/* FLIGHT LISTING */}
            <h3>Scheduled Flights</h3>
            <div>
                {flights.map((flight) => (
                    <div key={flight.id} style={{ borderBottom: "1px solid #ccc", padding: "15px 0" }}>
                        {editingId === flight.id ? (
                            // EDIT ROW VIEW
                            <div>
                                <input value={editFlightNumber} onChange={(e) => setEditFlightNumber(e.target.value)} />
                                <input value={editOrigin} onChange={(e) => setEditOrigin(e.target.value)} />
                                <input value={editDestination} onChange={(e) => setEditDestination(e.target.value)} />
                                <input type="datetime-local" value={editDepartureTime} onChange={(e) => setEditDepartureTime(e.target.value)} />
                                <input type="datetime-local" value={editArrivalTime} onChange={(e) => setEditArrivalTime(e.target.value)} />
                                <select value={editAircraftId} onChange={(e) => setEditAircraftId(e.target.value)}>
                                    <option value="">Select Aircraft</option>
                                    {aircraftFleet.map((ac) => (
                                        <option key={ac.id} value={ac.id}>
                                            {ac.aircraft_code}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => saveUpdate(flight.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        ) : (
                            // DEFAULT ROW VIEW
                            <div>
                                <h4>Flight {flight.flight_number}: {flight.origin} → {flight.destination}</h4>
                                <p><strong>Departure:</strong> {formatDateTime(flight.departure_time)}</p>
                                <p><strong>Arrival:</strong> {formatDateTime(flight.arrival_time)}</p>
                                <p><strong>Aircraft Assigned:</strong> ID {flight.aircraft_id}</p>
                                <button onClick={() => startEditing(flight)}>Edit</button>
                                <button onClick={() => deleteFlight(flight.id)} style={{ marginLeft: "10px", color: "red" }}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Flights