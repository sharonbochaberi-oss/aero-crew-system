from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.report import Report
from models.user import User
from extensions import db

report_bp = Blueprint("reports", __name__)

@report_bp.route("/", methods=["GET"])
@jwt_required()
def get_reports():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    # Restrict viewing all reports exclusively to admins
    if user.role != "admin":
        return {"error": "Unauthorized access to global reports registry"}, 403
        
    reports = Report.query.all()
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "report_type": r.report_type,
            "content": r.content,
            "user_id": r.user_id,
            "flight_id": r.flight_id,
            # Fallback string mappings if relationships aren't eagerly loaded
            "submitted_by": getattr(r.user, 'username', f"User {r.user_id}"),
            "flight_number": getattr(r.flight, 'flight_number', f"ID {r.flight_id}")
        })
    return result, 200

@report_bp.route("/", methods=["POST"])
@jwt_required()
def create_report():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    data = request.json
    
    if not data or not all(k in data for k in ("report_type", "content", "flight_id")):
        return {"error": "Missing required fields"}, 400

    # Role Scope enforcement checks
    pilot_types = ["Flight report", "Weather report", "Aircraft issue report"]
    fa_types = ["Cabin report", "Passenger incident report"]
    
    if user.role == "pilot" and data["report_type"] not in pilot_types:
        return {"error": f"Pilots cannot file '{data['report_type']}' forms."}, 403
    if user.role == "flight_attendant" and data["report_type"] not in fa_types:
        return {"error": f"Cabin crews cannot file '{data['report_type']}' forms."}, 403

    report = Report(
        report_type=data["report_type"],
        content=data["content"],
        user_id=current_user_id, # Safely tie to the verified session identity
        flight_id=int(data["flight_id"])
    )

    db.session.add(report)
    db.session.commit()
    return {"message": "Report submitted successfully"}, 201

@report_bp.route("/<int:id>/", methods=["DELETE"])
@jwt_required()
def delete_report(id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    if user.role != "admin":
        return {"error": "Administrative clearance required to delete files."}, 403
        
    report = Report.query.get_or_404(id)
    db.session.delete(report)
    db.session.commit()
    return {"message": "Report permanently removed"}, 200