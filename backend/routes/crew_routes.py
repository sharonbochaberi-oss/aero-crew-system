from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from models.user import User
from models.flight import Flight
from extensions import db

crew_bp = Blueprint("crew", __name__)

@crew_bp.route("/assignments/", methods=["GET"])
@jwt_required()
def get_assignments():
    """Returns all flights alongside their assigned crew members."""
    flights = Flight.query.all()
    result = []
    
    for flight in flights:
        crew_list = []
        for user in flight.crew_members:
            crew_list.append({
                "id": user.id,
                "full_name": user.full_name,
                "role": getattr(user, 'role', 'Crew')
            })
            
        result.append({
            "flight_id": flight.id,
            "flight_number": flight.flight_number,
            "origin": flight.origin,
            "destination": flight.destination,
            "crew": crew_list
        })
        
    return result, 200

@crew_bp.route("/assign/", methods=["POST"])
@jwt_required()
def assign_crew():
    data = request.json
    
    if not data or "user_id" not in data or "flight_id" not in data:
        return {"error": "Missing user_id or flight_id"}, 400

    user = User.query.get(data["user_id"])
    flight = Flight.query.get(data["flight_id"])

    if not user or not flight:
        return {"error": "Invalid user or flight"}, 404

    if user in flight.crew_members:
        return {"message": "Crew member already assigned to this flight"}, 200

    flight.crew_members.append(user)
    db.session.commit()

    return {"message": "Crew assigned successfully"}, 201

@crew_bp.route("/remove/", methods=["POST"])
@jwt_required()
def remove_crew():
    data = request.json
    
    if not data or "user_id" not in data or "flight_id" not in data:
        return {"error": "Missing user_id or flight_id"}, 400

    user = User.query.get(data["user_id"])
    flight = Flight.query.get(data["flight_id"])

    if not user or not flight:
        return {"error": "Invalid user or flight"}, 404

    if user in flight.crew_members:
        flight.crew_members.remove(user)
        db.session.commit()
        return {"message": "Crew member removed from flight"}, 200

    return {"error": "Crew member not found on this flight"}, 404