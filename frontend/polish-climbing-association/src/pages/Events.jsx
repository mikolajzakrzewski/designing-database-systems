import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Mountain, Star, Trophy, Target, Compass } from 'lucide-react';

import './Events.css'; 



const Events = () => {
  const [currentPage, setCurrentPage] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    participationType: '',
  });
const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

 const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setCurrentPage('registration');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/events');
      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();

      
      const formatted = data.map(e => ({
        id: e.event_id,
        type: e.type, 
        title: e.name,
        date: `${new Date(e.start_time).toLocaleDateString()} - ${new Date(e.end_time).toLocaleDateString()}`,
        location: e.location,
        difficulty: e.difficulty, 
        participants: 0,
        maxParticipants: 20,
        price: `$${e.participation_cost.toFixed(2)}`,
        image: e.picture ? `data:image/jpeg;base64,${e.picture}` : null,
        description: e.description,

        includes: [],
      }));

      setEvents(formatted);
    } catch (err) {
      console.error('Błąd ładowania wydarzeń:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

  const registerToEvent = async () => {
  if (!formData.participationType) {
    setToast({ show: true, message: 'Please select a participation type.', type: 'danger' });
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setToast({ show: true, message: 'You must be logged in to register.', type: 'warning' });
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/register_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        event_id: selectedEvent.id,
        participation_type: formData.participationType
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Registration failed');
    }

    setToast({ show: true, message: data.msg, type: 'success' });

    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
      setCurrentPage('events');
      setSelectedEvent(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        participationType: '',
        emergencyContact: '',
        emergencyPhone: '',
        dietaryRestrictions: '',
        comments: ''
      });
    }, 2500);

  } catch (err) {
    setToast({ show: true, message: err.message, type: 'danger' });
  }

  setCurrentPage('events');
};






  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'expedition': return <Compass className="type-icon" />;
      case 'competition': return <Trophy className="type-icon" />;
      case 'training': return <Target className="type-icon" />;
      default: return <Mountain className="type-icon" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'expedition': return 'type-expedition';
      case 'competition': return 'type-competition';
      case 'training': return 'type-training';
      default: return 'type-default';
    }
  };

 
  if (currentPage === 'payu') {
  return (
    <div className="app-container">
      <div className="payment-simulation">
        <h1>Redirecting to PayU...</h1>
        <p>Please wait while we process your payment.</p>
        <div className="loader"></div>
      </div>
    </div>
  );
}


  // Registration Page
  if (currentPage === 'registration' && selectedEvent) {
    return (
      <div className="app-container">
        <div className="registration-container">
          <div className="registration-wrapper">
            <button 
              onClick={() => setCurrentPage('events')}
              className="back-button"
              type="button"
            >
              ← Back to Events
            </button>
            
            <div className="registration-card">
              <div className="registration-header">
                <h1>Event Registration</h1>
                <p>Register for: {selectedEvent.title}</p>
                <div className={`event-type-badge ${getTypeColor(selectedEvent.type)}`}>
                  {getTypeIcon(selectedEvent.type)}
                  <span>{selectedEvent.type.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="registration-content">
                <div className="event-summary">
                  <h2>{selectedEvent.title}</h2>
                  <div className="event-details-grid">
                    <div className="event-detail">
                      <Calendar className="icon" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="event-detail">
                      <MapPin className="icon" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="event-detail">
                      <Users className="icon" />
                      <span>Price: {selectedEvent.price}</span>
                    </div>
                    <div className="event-detail">
                      <Mountain className="icon" />
                      <span>{selectedEvent.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="registration-form">
                  
                  

                  

                  <div className="form-group">
                    <label>Participation Type *</label>
                    <select
                      name="participationType"
                      required
                      value={formData.participationType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your participation type</option>
                      <option value="participant">Participant</option>
                      <option value="coach">Coach</option>
                      <option value="judge">Judge</option>
                    </select>
                  </div>

                  

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('events')}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
  type="button"
  className="btn-primary"
  onClick={registerToEvent}
>
  Register
</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="app-container">
      {/* Header */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <Mountain className="hero-icon" />
            Polish Climbing Association Events
          </h1>
          <p className="hero-subtitle">
            Join our thrilling climbing events and take your adventure to new heights. 
            From beginner trainings to advanced expeditions and competitive events.
          </p>
        </div>
      </div>

{toast.show && (
  <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
    <div className={`toast align-items-center text-bg-${toast.type} show`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          {toast.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })}></button>
      </div>
    </div>
  </div>
)}
      {/* Events Grid */}
      <div className="events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <p>
            Choose from our carefully crafted climbing experiences: expeditions for outdoor adventures, 
            competitions for competitive climbers, and training courses for skill development.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} className="event-photo" />
                <div className="event-badges">
                  <div className={`event-type-badge ${getTypeColor(event.type)}`}>
                    {getTypeIcon(event.type)}
                    <span>{event.type.toUpperCase()}</span>
                  </div>
                  <span className={`difficulty-badge ${getDifficultyColor(event.difficulty)}`}>
                    {event.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-info">
                  <div className="event-detail">
                    <Calendar className="icon" />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <MapPin className="icon" />
                    <span>{event.location}</span>
                  </div>
                  
                </div>

                <div className="event-footer">
                  <div className="event-pricing">
                    <span className="price">{event.price}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleRegister(event)}
                    disabled={event.participants >= event.maxParticipants}
                    className={`register-btn ${event.participants >= event.maxParticipants ? 'disabled' : ''}`}
                  >
                    {event.participants >= event.maxParticipants ? 'Event Full' : 'Register Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Mountain className="footer-icon" />
            <h3>Polish Climbing Association</h3>
          </div>
          <p className="footer-tagline">Your gateway to extraordinary climbing experiences</p>
          <div className="footer-contact">
            <span>📧 info@polishclimbingassociation.com</span>
            <span>📞 (+48) 123-123-123</span>
            <span>📍 Warsaw, Poland</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;