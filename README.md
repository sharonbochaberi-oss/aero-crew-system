Aero Crew Management System (ACMS)

Aero Crew Management System (ACMS) is a full-stack web application for managing airline operations, including aircraft, flights, crew assignments, and operational reports.

## Features
User Authentication (JWT)
Role-Based Access Control
Admin
Pilot
Flight Attendant/Crew
Aircraft Management
Flight Scheduling
Crew Assignment Management
Operational Reports
Responsive Dashboard

Tech Stack
## Backend
Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-JWT-Extended
SQLite

## Frontend
React
React Router
Axios
Vite

## Installation
Backend
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python app.py

Backend runs on:

http://127.0.0.1:5000

## Frontend
cd frontend

npm install

npm run dev

Frontend runs on:

http://localhost:5173

## Default Workflow
Register a user.
Login with credentials.
Receive JWT token and role.
Access role-specific dashboard.
Manage flights, aircraft, crew, and reports.

## Roles
Role	Access
Admin	Full system management
Pilot	View assigned flights
Flight Attendant	View crew assignments and reports

## API Endpoints
POST   /auth/register
POST   /auth/login

GET    /flights
POST   /flights

GET    /aircraft
POST   /aircraft

GET    /crew
POST   /crew

GET    /reports
POST   /reports

## Project Structure
backend/
├── models/
├── routes/
├── app.py
├── config.py

frontend/
├── src/
│   ├── pages/
│   ├── layouts/
│   ├── routes/
│   └── services/

## Author

Developed as an Airline Crew and Flight Management System project using Flask and React.

BOCHABERI SHARON