from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from functools import wraps
from app.db import db
from app.bcrypt import bcrypt
from app.models import User, Role, UserRole, Event, EventUser


api_bp = Blueprint('api', __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        admin_role = Role.query.filter_by(role_name='admin').first()
        if not admin_role or not UserRole.query.filter_by(user_id=user_id, role_id=admin_role.role_id).first():
            return jsonify({'msg': 'Admin privileges required'}), 403

        return fn(*args, **kwargs)

    return wrapper


@api_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['first_name', 'last_name', 'email', 'password']
    if not all(key in data for key in required_fields):
        return jsonify({'msg': f'Missing required fields {", ".join(required_fields)}'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'User already exists'}), 409

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        passwordHash=hashed_pw,
        rating_points=0.0,
        club_id=data.get('club_id')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'User registered successfully'})


@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.passwordHash, data['password']):
        access_token = create_access_token(identity=user.user_id)
        return jsonify(access_token=access_token)

    return jsonify({'msg': 'Bad credentials'}), 401


@api_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        'user_id': user.user_id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'rating_points': float(user.rating_points),
        'club_id': user.club_id
    })


@api_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.json
    user = User.query.get_or_404(user_id)

    for field in ['first_name', 'last_name', 'email', 'rating_points', 'club_id']:
        if field in data:
            setattr(user, field, data[field])

    if 'password' in data:
        user.passwordHash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()
    return jsonify({'msg': 'User updated successfully'})


@api_bp.route('/profile/roles', methods=['GET'])
@jwt_required()
def get_user_roles():
    user_id = get_jwt_identity()
    roles = UserRole.query.filter_by(user_id=user_id).all()
    role_names = [Role.query.get(role.role_id).role_name for role in roles]
    return jsonify({'roles': role_names})


@api_bp.route('/profile/events', methods=['GET'])
@jwt_required()
def get_user_events():
    user_id = get_jwt_identity()
    events = EventUser.query.filter_by(user_id=user_id).all()
    result = []
    for entry in events:
        event = Event.query.get(entry.event_id)
        result.append({
            'event_id': event.event_id,
            'event_name': event.name,
            'participation_type': entry.participation_type,
            'start_time': event.start_time.isoformat(),
            'end_time': event.end_time.isoformat(),
            'location': event.location
        })
    return jsonify(result)


@api_bp.route('/add_event', methods=['POST'])
@admin_required
def add_event():
    data = request.json
    required_fields = ['name', 'location', 'start_time', 'end_time', 'type', 'participation_cost']
    if not all(field in data for field in required_fields):
        return jsonify({'msg': f'Missing required fields {", ".join(required_fields)}'}), 400

    try:
        start_time = datetime.fromisoformat(data['start_time'])
        end_time = datetime.fromisoformat(data['end_time'])
    except ValueError:
        return jsonify({'msg': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400

    if end_time <= start_time:
        return jsonify({'msg': 'End time must be after start time'}), 400

    if data['type'] not in ['Competition', 'Training', 'Expedition']:
        return jsonify({'msg': 'Invalid event type. Must be one of: Competition, Training, Expedition'}), 400

    if not isinstance(data['participation_cost'], (int, float)) or data['participation_cost'] < 0:
        return jsonify({'msg': 'Participation cost must be a non-negative number'}), 400

    event = Event(
        name=data['name'],
        description=data.get('description'),
        location=data['location'],
        start_time=start_time,
        end_time=end_time,
        type=data['type'],
        participation_cost=data['participation_cost'],
        is_archived=data.get('is_archived', False)
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({'msg': 'Event created', 'event_id': event.event_id}), 201


@api_bp.route('/events', methods=['GET'])
def get_all_events():
    events = Event.query.all()
    return jsonify([{
        'event_id': e.event_id,
        'name': e.name,
        'description': e.description,
        'location': e.location,
        'start_time': e.start_time.isoformat(),
        'end_time': e.end_time.isoformat(),
        'type': e.type,
        'participation_cost': float(e.participation_cost)
    } for e in events])


@api_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event_by_id(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify({
        'event_id': event.event_id,
        'name': event.name,
        'description': event.description,
        'location': event.location,
        'start_time': event.start_time.isoformat(),
        'end_time': event.end_time.isoformat(),
        'type': event.type,
        'participation_cost': float(event.participation_cost)
    })


@api_bp.route('/events/<int:event_id>', methods=['PUT'])
@admin_required
def update_event(event_id):
    event = Event.query.get_or_404(event_id)

    if event.is_archived:
        return jsonify({'msg': 'Archived events cannot be modified'}), 403

    data = request.json

    for field in ['name', 'description', 'location', 'type']:
        if field in data:
            setattr(event, field, data[field])

    if 'participation_cost' in data:
        if not isinstance(data['participation_cost'], (int, float)) or data['participation_cost'] < 0:
            return jsonify({'msg': 'Participation cost must be a non-negative number'}), 400

        event.participation_cost = data['participation_cost']

    if 'start_time' in data:
        event.start_time = datetime.fromisoformat(data['start_time'])

    if 'end_time' in data:
        event.end_time = datetime.fromisoformat(data['end_time'])
        if event.end_time <= event.start_time:
            return jsonify({'msg': 'End time must be after start time'}), 400

    if 'is_archived' in data:
        event.is_archived = data['is_archived']

    db.session.commit()
    return jsonify({'msg': 'Event updated successfully'})


@api_bp.route('/register_event', methods=['POST'])
@jwt_required()
def register_event():
    user_id = get_jwt_identity()
    data = request.json

    event = Event.query.get_or_404(data['event_id'])
    if event.is_archived:
        return jsonify({'msg': 'Cannot register for an archived event'}), 400

    existing = EventUser.query.filter_by(user_id=user_id, event_id=data['event_id']).first()
    if existing:
        return jsonify({'msg': 'User already registered for this event'}), 409

    participation = EventUser(
        user_id=user_id,
        event_id=data['event_id'],
        participation_type=data['participation_type']
    )
    db.session.add(participation)
    db.session.commit()
    return jsonify({'msg': 'Successfully registered for event'})
