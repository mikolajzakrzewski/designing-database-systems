from app import create_app
from app.db import db
from datetime import datetime
from app.bcrypt import bcrypt
from app.models import User, Role, UserRole, Event


def load_picture_bytes(path):
    with open(path, 'rb') as f:
        return f.read()

app = create_app()

with app.app_context():
    db.create_all()
    for role in ['admin', 'user']:
        if not Role.query.filter_by(role_name=role).first():
            db.session.add(Role(role_name=role))

    db.session.commit()

    if not User.query.filter_by(email='user@user.com').first():
        hashed_pw = bcrypt.generate_password_hash('user123').decode('utf-8')
        user = User(
            first_name='Regular',
            last_name='User',
            email='user@user.com',
            passwordHash=hashed_pw,
            rating_points=0.0
        )
        db.session.add(user)
        db.session.commit()

        user_role = Role.query.filter_by(role_name='user').first()
        db.session.add(UserRole(user_id=user.user_id, role_id=user_role.role_id))
        db.session.commit()

    if not User.query.filter_by(email='admin@admin.com').first():
        hashed_pw = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = User(
            first_name='Admin',
            last_name='User',
            email='admin@admin.com',
            passwordHash=hashed_pw,
            rating_points=0.0
        )
        db.session.add(admin)
        db.session.commit()

         # Sample events
    

        admin_role = Role.query.filter_by(role_name='admin').first()
        db.session.add(UserRole(user_id=admin.user_id, role_id=admin_role.role_id))
        db.session.commit()

    if Event.query.count() == 0:
        sample_events = [
            Event(
                name="Alpine Adventure Weekend",
                description="Two-day alpine climbing experience with certified guides.",
                location="Rocky Mountain National Park",
                start_time=datetime(2025, 6, 15, 9, 0),
                end_time=datetime(2025, 6, 16, 18, 0),
                type="expedition",
                participation_cost=285.0,
                difficulty="Intermediate",
                picture=load_picture_bytes('assets/expedition1.jpg')
            ),
            Event(
                name="Multi-Pitch Mastery",
                description="Advanced 3-day course focusing on multi-pitch techniques.",
                location="Yosemite Valley",
                start_time=datetime(2025, 7, 12, 9, 0),
                end_time=datetime(2025, 7, 14, 17, 0),
                type="expedition",
                participation_cost=450.0,
                  difficulty="advanced",
                picture=load_picture_bytes('assets/expedition2.jpeg')
            ),
            Event(
                name="Indoor Competition Series",
                description="Monthly indoor climbing competition for all skill levels.",
                location="Vertical Limits Gym",
                start_time=datetime(2025, 7, 8, 10, 0),
                end_time=datetime(2025, 7, 8, 16, 0),
                type="competition",
                participation_cost=45.0,
                  difficulty="begginer",
                picture=load_picture_bytes('assets/competition1.jpeg')
            ),
            Event(
                name="Beginner's Rock Course",
                description="Perfect intro to outdoor rock climbing.",
                location="Garden of the Gods",
                start_time=datetime(2025, 6, 22, 9, 0),
                end_time=datetime(2025, 6, 23, 17, 0),
                type="training",
                participation_cost=195.0,
                  difficulty="Advanced",
                picture=load_picture_bytes('assets/training1.jpeg')
            )
        ]
        
        db.session.add_all(sample_events)
        db.session.commit()
        print(f"{len(sample_events)} sample events added.")

if __name__ == '__main__':
    app.run(port=8000)
