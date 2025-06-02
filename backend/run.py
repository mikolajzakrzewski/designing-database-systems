from app import create_app
from app.db import db
from app.bcrypt import bcrypt
from app.models import User, Role, UserRole


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

        admin_role = Role.query.filter_by(role_name='admin').first()
        db.session.add(UserRole(user_id=admin.user_id, role_id=admin_role.role_id))
        db.session.commit()

if __name__ == '__main__':
    app.run(port=8000)
