from extensions import db

crew_assignments = db.Table(

    "crew_assignments",

    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey("users.id")
    ),

    db.Column(
        "flight_id",
        db.Integer,
        db.ForeignKey("flights.id")
    )
)