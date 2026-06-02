from app import app

from extensions import db

from models.user import User

with app.app_context():

    db.drop_all()

    db.create_all()

    admin = User(
        full_name="Admin User",
        email="admin@test.com",
        role="admin"
    )

    admin.set_password("1234")

    db.session.add(admin)

    db.session.commit()

    print("Database seeded")