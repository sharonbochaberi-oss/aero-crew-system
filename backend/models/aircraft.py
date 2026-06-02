from extensions import db

class Aircraft(db.Model):

    __tablename__ = "aircraft"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    registration_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    model = db.Column(
        db.String(100),
        nullable=False
    )

    capacity = db.Column(
        db.Integer,
        nullable=False
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Active"
    )

    flights = db.relationship(
        "Flight",
        backref="aircraft"
    )