from flask import Flask
from flask_cors import CORS

from config import Config

from extensions import db
from extensions import migrate
from extensions import jwt

# MODELS
from models.user import User
from models.aircraft import Aircraft
from models.flight import Flight
from models.report import Report

# ROUTES
from routes.auth_routes import auth_bp
from routes.flight_routes import flight_bp
from routes.aircraft_routes import aircraft_bp
from routes.crew_routes import crew_bp
from routes.report_routes import report_bp

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

migrate.init_app(app, db)

jwt.init_app(app)

# REGISTER BLUEPRINTS

app.register_blueprint(
    auth_bp,
    url_prefix="/auth"
)

app.register_blueprint(
    flight_bp,
    url_prefix="/flights"
)

app.register_blueprint(
    aircraft_bp,
    url_prefix="/aircraft"
)

app.register_blueprint(
    crew_bp,
    url_prefix="/crew"
)

app.register_blueprint(
    report_bp,
    url_prefix="/reports"
)

@app.route("/")
def home():

    return {
        "message": "ACMS API Running"
    }

with app.app_context():
    db.create_all()
    print("Database tables created")

if __name__ == "__main__":

    app.run(debug=True)