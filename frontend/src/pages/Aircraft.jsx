import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"

function Aircraft() {
    // List state
    const [aircraft, setAircraft] = useState([])

    // Creation form states
    const [registrationNumber, setRegistrationNumber] = useState("")
    const [model, setModel] = useState("")
    const [capacity, setCapacity] = useState("")
    const [status, setStatus] = useState("Active") // Default value

    // Inline editing states
    const [editingId, setEditingId] = useState(null)
    const [editRegNumber, setEditRegNumber] = useState("")
    const [editModel, setEditModel] = useState("")
    const [editCapacity, setEditCapacity] = useState("")
    const [editStatus, setEditStatus] = useState("")

    const getAircraft = async () => {
        try {
            const response = await api.get("/aircraft/")
            setAircraft(response.data)
        } catch (error) {
            console.error("Error fetching aircraft:", error)
        }
    }

    useEffect(() => {
        getAircraft()
    }, [])

    const createAircraft = async () => {
        if (!registrationNumber || !model || !capacity || !status) {
            return alert("Please fill out all fields.")
        }
        
        try {
            await api.post("/aircraft/", {
                registration_number: registrationNumber,
                model,
                capacity: parseInt(capacity, 10),
                status
            })
            // Reset input values
            setRegistrationNumber("")
            setModel("")
            setCapacity("")
            setStatus("Active")
            getAircraft()
        } catch (error) {
            console.error("Error creating aircraft:", error)
        }
    }

    const deleteAircraft = async (id) => {
        if (window.confirm("Are you sure you want to delete this aircraft?")) {
            try {
                await api.delete(`/aircraft/${id}/`)
                getAircraft()
            } catch (error) {
                console.error("Error deleting aircraft:", error)
            }
        }
    }

    const startEditing = (item) => {
        setEditingId(item.id)
        setEditRegNumber(item.registration_number)
        setEditModel(item.model)
        setEditCapacity(item.capacity)
        setEditStatus(item.status)
    }

    const saveUpdate = async (id) => {
        try {
            await api.put(`/aircraft/${id}/`, {
                registration_number: editRegNumber,
                model: editModel,
                capacity: parseInt(editCapacity, 10),
                status: editStatus
            })
            setEditingId(null)
            getAircraft()
        } catch (error) {
            console.error("Error updating aircraft:", error)
        }
    }

    return (
        <DashboardLayout>
            <h1>Aircraft Management</h1>

            {/* CREATE FORM */}
            <div style={{ marginBottom: "20px" }}>
                <h3>Add New Aircraft</h3>
                <input
                    placeholder="Registration Number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                />
                <br /><br />
                <input
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
                <br /><br />
                <input
                    placeholder="Capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
                <br /><br />
                <label>Status: </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Grounded">Grounded</option>
                </select>
                <br /><br />
                <button onClick={createAircraft}>Create Aircraft</button>
            </div>

            <hr />

            {/* FLEET LISTING */}
            <h3>Aircraft Fleet</h3>
            <div>
                {aircraft.map((item) => (
                    <div key={item.id} style={{ borderBottom: "1px solid #ccc", padding: "15px 0" }}>
                        {editingId === item.id ? (
                            // EDIT ROW VIEW
                            <div>
                                <input 
                                    value={editRegNumber} 
                                    onChange={(e) => setEditRegNumber(e.target.value)} 
                                />
                                <input 
                                    value={editModel} 
                                    onChange={(e) => setEditModel(e.target.value)} 
                                />
                                <input 
                                    type="number"
                                    value={editCapacity} 
                                    onChange={(e) => setEditCapacity(e.target.value)} 
                                />
                                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Grounded">Grounded</option>
                                </select>
                                <button onClick={() => saveUpdate(item.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        ) : (
                            // DEFAULT ROW VIEW
                            <div>
                                <h4>{item.registration_number} — {item.model}</h4>
                                <p>Capacity: {item.capacity} seats</p>
                                <p>Status: <span style={{ fontWeight: "bold" }}>{item.status}</span></p>
                                <button onClick={() => startEditing(item)}>Edit</button>
                                <button onClick={() => deleteAircraft(item.id)} style={{ marginLeft: "10px", color: "red" }}>
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

export default Aircraft