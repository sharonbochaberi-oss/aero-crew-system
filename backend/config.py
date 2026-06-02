import os

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///acms.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = "secret-key"

    JWT_SECRET_KEY = "jwt-secret-key"