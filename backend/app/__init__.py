from flask import Flask
from backend.app.db import db
from backend.app.bcrypt import bcrypt
from backend.app.jwt import jwt
from backend.app.routes import api_bp
from datetime import timedelta


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://psbd:psbdpassword@localhost:5433/polish-climbing-association'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'
    app.config['JWT_VERIFY_SUB'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(api_bp)

    return app
