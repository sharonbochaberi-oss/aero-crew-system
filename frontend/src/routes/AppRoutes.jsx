import {
    Routes,
    Route
} from "react-router-dom"

import Login from "../pages/Login"

import Dashboard from "../pages/Dashboard"

import Flights from "../pages/Flights"

import Aircraft from "../pages/Aircraft"

import Crew from "../pages/Crew"

import Reports from "../pages/Reports"

import ProtectedRoute from "../components/ProtectedRoute"

import Register from "../pages/Register"

function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/flights"
                element={
                    <ProtectedRoute>
                        <Flights />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/aircraft"
                element={
                    <ProtectedRoute>
                        <Aircraft />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/crew"
                element={
                    <ProtectedRoute>
                        <Crew />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/register"
                element={
                <Register />
                
                }
            />

        </Routes>
    )
}

export default AppRoutes