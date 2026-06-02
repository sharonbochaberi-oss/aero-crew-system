from extensions import db

from datetime import datetime

class Report(db.Model):

    __tablename__ = "reports"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    report_type = db.Column(
        db.String(50)
    )

    content = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    flight_id = db.Column(
        db.Integer,
        db.ForeignKey("flights.id")
    )