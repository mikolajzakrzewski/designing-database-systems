from flask import Flask
from app.db import db
from app.bcrypt import bcrypt
from app.jwt import jwt
from app.routes import api_bp
from datetime import timedelta
from flask_cors import CORS


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
    
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    return app
