from backend.app import create_app
from backend.app.models import db


app = create_app()

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(port=8000)
