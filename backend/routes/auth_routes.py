from flask import Blueprint
from flask import request

from models.user import User

from extensions import db

from flask_jwt_extended import (
    create_access_token,
    jwt_required
)

auth_bp = Blueprint(
    "auth",
    __name__
)

@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.json

    if not data or not all(k in data for k in ("full_name", "email", "password", "role")):
        return {"error": "Missing required fields"}, 400

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:

        return {
            "error": "Email already exists"
        }, 400

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        role=data["role"]
    )

    user.set_password(
        data["password"]
    )

    db.session.add(user)

    db.session.commit()

    return {
        "message": "User registered"
    }, 201

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.json

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:

        return {
            "error": "Invalid credentials"
        }, 401

    if not user.check_password(
        data["password"]
    ):

        return {
            "error": "Invalid credentials"
        }, 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }

@auth_bp.route(
    "/logout",
    methods=["POST"]
)
@jwt_required()
def logout():
    return {"message": "Logged out successfully"}, 200

@auth_bp.route(
    "/users/",
    methods=["GET"]
)
@jwt_required()
def list_users():
    users = User.query.all()
    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
        for user in users
    ], 200