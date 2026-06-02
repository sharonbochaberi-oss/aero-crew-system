from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from models.aircraft import Aircraft
from extensions import db

aircraft_bp = Blueprint("aircraft", __name__)

@aircraft_bp.route("/", methods=["GET"])
@jwt_required()
def get_aircraft():
    aircraft_list = Aircraft.query.all()
    result = []
    
    for item in aircraft_list:
        result.append({
            "id": item.id,
            "registration_number": item.registration_number,
            "model": item.model,
            "capacity": item.capacity,
            "status": item.status
        })
        
    return result, 200

@aircraft_bp.route("/", methods=["POST"])
@jwt_required()
def create_aircraft():
    data = request.json
    
    if not data or not all(k in data for k in ("registration_number", "model", "capacity", "status")):
        return {"error": "Missing required fields"}, 400

    aircraft = Aircraft(
        registration_number=data["registration_number"],
        model=data["model"],
        capacity=int(data["capacity"]),
        status=data["status"]
    )

    db.session.add(aircraft)
    db.session.commit()

    return {"message": "Aircraft created"}, 201

@aircraft_bp.route("/<int:id>/", methods=["PUT"])
@jwt_required()
def update_aircraft(id):
    aircraft = Aircraft.query.get_or_404(id)
    data = request.json

    aircraft.registration_number = data.get("registration_number", aircraft.registration_number)
    aircraft.model = data.get("model", aircraft.model)
    aircraft.capacity = int(data.get("capacity", aircraft.capacity))
    aircraft.status = data.get("status", aircraft.status)

    db.session.commit()

    return {"message": "Aircraft updated"}, 200

@aircraft_bp.route("/<int:id>/", methods=["DELETE"])
@jwt_required()
def delete_aircraft(id):
    aircraft = Aircraft.query.get_or_404(id)
    
    db.session.delete(aircraft)
    db.session.commit()

    return {"message": "Aircraft deleted"}, 200