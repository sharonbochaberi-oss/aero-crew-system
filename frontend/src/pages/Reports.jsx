import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"

function Reports() {
    const { user } = useAuth()
    const role = user?.role || ""
    
    // Form and Registry States
    const [reportsList, setReportsList] = useState([])
    const [flights, setFlights] = useState([])
    const [reportType, setReportType] = useState("")
    const [content, setContent] = useState("")
    const [flightId, setFlightId] = useState("")

    useEffect(() => {
        if (role === "admin") {
            fetchAdminReports()
        } else if (role) {
            fetchAssignedFlights()
        }
    }, [role])

    const fetchAdminReports = async () => {
        try {
            const response = await api.get("/reports/")
            setReportsList(response.data)
        } catch (error) {
            console.error("Error loading registry:", error)
        }
    }

    const fetchAssignedFlights = async () => {
        try {
            // Reuses flights endpoint or specific personal manifest endpoint if preferred
            const response = await api.get("/flights/")
            setFlights(response.data)
        } catch (error) {
            console.error("Error loading flights list:", error)
        }
    }

    const submitReport = async () => {
        if (!reportType || !content || !flightId) {
            return alert("Please fill out all fields.")
        }

        try {
            await api.post("/reports/", {
                report_type: reportType,
                content,
                flight_id: parseInt(flightId, 10)
            })
            alert("Report filed successfully.")
            setReportType("")
            setContent("")
            setFlightId("")
        } catch (error) {
            console.error("Submission failed:", error)
        }
    }

    const deleteReport = async (id) => {
        if (window.confirm("Permanently discard this reporting log entry?")) {
            try {
                await api.delete(`/reports/${id}/`)
                fetchAdminReports()
            } catch (error) {
                console.error("Deletion failed:", error)
            }
        }
    }

    // Role dynamic dropdown generator mappings
    const getOptionsForRole = () => {
        if (role === "pilot") {
            return (
                <>
                    <option value="Flight report">Flight report</option>
                    <option value="Weather report">Weather report</option>
                    <option value="Aircraft issue report">Aircraft issue report</option>
                </>
            )
        }
        if (role === "flight_attendant") {
            return (
                <>
                    <option value="Cabin report">Cabin report</option>
                    <option value="Passenger incident report">Passenger incident report</option>
                </>
            )
        }
        return null
    }

    return (
        <DashboardLayout>
            <h1>Operational Intelligence Reports</h1>

            {/* CREW SUBMISSION PANEL */}
            {role !== "admin" && (
                <div style={{ marginBottom: "30px" }}>
                    <h3>File Flight Operations Entry</h3>
                    
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="">Select Log Category</option>
                        {getOptionsForRole()}
                    </select>
                    
                    <br /><br />
                    
                    <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                        <option value="">Select Associated Flight</option>
                        {flights.map((f) => (
                            <option key={f.id} value={f.id}>
                                Flight {f.flight_number} ({f.origin} → {f.destination})
                            </option>
                        ))}
                    </select>

                    <br /><br />
                    
                    <textarea
                        placeholder="Log full report narrative content details here..."
                        value={content}
                        rows={5}
                        style={{ width: "100%", maxWidth: "500px" }}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    
                    <br /><br />
                    <button onClick={submitReport}>Submit Report</button>
                </div>
            )}

            {/* ADMINISTRATIVE COMPLIANCE VIEW PANEL */}
            {role === "admin" && (
                <div>
                    <h3>Consolidated Fleet Operations Logs</h3>
                    {reportsList.length === 0 ? (
                        <p style={{ color: "gray", fontStyle: "italic" }}>No submitted reports found.</p>
                    ) : (
                        reportsList.map((rep) => (
                            <div key={rep.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                                <h4>[{rep.report_type}] — Flight {rep.flight_number}</h4>
                                <p style={{ color: "#555", fontSize: "0.9rem" }}>
                                    Filed By: <strong>{rep.submitted_by}</strong> (User ID: {rep.user_id})
                                </p>
                                <blockquote style={{ background: "#f9f9f9", padding: "10px", margin: "10px 0" }}>
                                    {rep.content}
                                </blockquote>
                                <button onClick={() => deleteReport(rep.id)} style={{ color: "white", backgroundColor: "red", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "3px" }}>
                                    Delete Log Entry
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </DashboardLayout>
    )
}

export default Reports