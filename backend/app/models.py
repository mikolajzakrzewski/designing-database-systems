from backend.app.db import db


class Club(db.Model):
    __tablename__ = 'clubs'
    club_id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.club_id'))
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    rating_points = db.Column(db.Float)
    passwordHash = db.Column(db.String(255), nullable=False)


class Role(db.Model):
    __tablename__ = 'roles'
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(255), unique=True, nullable=False)


class UserRole(db.Model):
    __tablename__ = 'user_role'
    unique_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id', ondelete='CASCADE'))


class Event(db.Model):
    __tablename__ = 'events'
    event_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1000))
    location = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    participation_cost = db.Column(db.Numeric(10, 2))
    is_archived = db.Column(db.Boolean, default=False)


class EventUser(db.Model):
    __tablename__ = 'event_user'
    unique_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)
    participation_type = db.Column(db.String(50), nullable=False)
