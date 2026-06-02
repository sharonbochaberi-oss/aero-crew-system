from extensions import db

from models.crew_assignment import crew_assignments

class Flight(db.Model):

    __tablename__ = "flights"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    flight_number = db.Column(
        db.String(50),
        nullable=False
    )

    origin = db.Column(
        db.String(100),
        nullable=False
    )

    destination = db.Column(
        db.String(100),
        nullable=False
    )

    departure_time = db.Column(
        db.DateTime
    )

    arrival_time = db.Column(
        db.DateTime
    )

    aircraft_id = db.Column(
        db.Integer,
        db.ForeignKey("aircraft.id")
    )

    crew_members = db.relationship(
        "User",
        secondary=crew_assignments,
        back_populates="assigned_flights"
    )

    reports = db.relationship(
        "Report",
        backref="flight"
    )