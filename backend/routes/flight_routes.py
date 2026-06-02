from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from models.flight import Flight
from extensions import db
from datetime import datetime

flight_bp = Blueprint("flights", __name__)

@flight_bp.route("/", methods=["GET"])
def get_flights():
    flights = Flight.query.all()
    result = []
    
    for flight in flights:
        result.append({
            "id": flight.id,
            "flight_number": flight.flight_number,
            "origin": flight.origin,
            "destination": flight.destination,
            "departure_time": flight.departure_time.isoformat() if flight.departure_time else None,
            "arrival_time": flight.arrival_time.isoformat() if flight.arrival_time else None,
            "aircraft_id": flight.aircraft_id
        })
        
    return result, 200

@flight_bp.route("/", methods=["POST"])
@jwt_required()
def create_flight():
    data = request.json
    
    if not data or not all(k in data for k in ("flight_number", "origin", "destination", "departure_time", "arrival_time", "aircraft_id")):
        return {"error": "Missing required fields"}, 400

    flight = Flight(
        flight_number=data["flight_number"],
        origin=data["origin"],
        destination=data["destination"],
        departure_time=datetime.fromisoformat(data["departure_time"]),
        arrival_time=datetime.fromisoformat(data["arrival_time"]),
        aircraft_id=int(data["aircraft_id"])
    )

    db.session.add(flight)
    db.session.commit()

    return {"message": "Flight created"}, 201

@flight_bp.route("/<int:id>/", methods=["PUT"])
@jwt_required()
def update_flight(id):
    flight = Flight.query.get_or_404(id)
    data = request.json

    flight.flight_number = data.get("flight_number", flight.flight_number)
    flight.origin = data.get("origin", flight.origin)
    flight.destination = data.get("destination", flight.destination)
    
    if "departure_time" in data:
        flight.departure_time = datetime.fromisoformat(data["departure_time"])
    if "arrival_time" in data:
        flight.arrival_time = datetime.fromisoformat(data["arrival_time"])
    if "aircraft_id" in data:
        flight.aircraft_id = int(data["aircraft_id"])

    db.session.commit()
    return {"message": "Flight updated"}, 200

@flight_bp.route("/<int:id>/", methods=["DELETE"])
@jwt_required()
def delete_flight(id):
    flight = Flight.query.get_or_404(id)
    
    db.session.delete(flight)
    db.session.commit()

    return {"message": "Flight deleted"}, 200