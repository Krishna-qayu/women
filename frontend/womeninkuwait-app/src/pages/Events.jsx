import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Events.css'; 

import eventsHeroImage from '../assets/6.png';
import joinSectionImage from '../assets/3.jpg';
import coffee_and_connect from '../assets/coffee-and-connect-event.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const whyJoinData = [
  {
    title: "Online Events",
    text: "Attend live webinars from experts, 80 minutes co-working hours, or skill swap where you share your skills with each other. Or you can just log in with a cup of coffee and chat with your new friends. ",
  },
  {
    title: "Offline Events",
    text: "Dress up to the nine for red carpet dinner, visit our collaborator’s pop-up market, or attend vision board parties. We’re continuously coming up with new concepts to keep you entertained.",
  },
  {
    title: "Volunteer",
    text: "We love to see women take the lead. If you think you would like to host any of the events or contribute in some other ways, drop us an email. ",
  },
  {
    title: "Mentorship",
    text: "Find mentors invested in your personal growth. Connect with them directly through our website or meet them at our specialized career-based events. ",
  },
];

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventTime = (timeString) => {
    if (!timeString) return '';
    // Format time (assuming HH:MM format)
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        {event.image && (
          <img src={event.image} alt={event.title} className="modal-image" />
        )}
        <div className="modal-text-content">
          <h2 className="modal-title">{event.title}</h2>
          <p className="modal-date">
            {formatEventDate(event.date)}
            {event.time && ` • ${formatEventTime(event.time)}`}
          </p>
          <p className="modal-description">{event.description}</p>
          {event.location && (
            <div className="modal-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <p><span className="modal-info-label">Location:</span>{event.location}</p>
            </div>
          )}
          {event.activityIncludes && (
            <div className="modal-activity-includes">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <p><span className="modal-info-label">Activity Includes:</span>{event.activityIncludes}</p>
            </div>
          )}
          {event.entryFees && (
            <div className="modal-entry-fees">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <p><span className="modal-info-label">Entry Fees:</span>{event.entryFees}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/events`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (bannerImage) => {
    if (!bannerImage) return coffee_and_connect; // Default fallback image
    if (bannerImage.startsWith('http://') || bannerImage.startsWith('https://')) {
      return bannerImage;
    }
    return `${API_URL}${bannerImage}`;
  };

  const transformEventForUI = (event) => {
    return {
      ...event,
      image: getImageUrl(event.bannerImage),
      location: event.location || 'Location TBD'
    };
  };

  // Separate upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter(event => {
      if (!event.date) return true; // Include events without date as upcoming
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .map(transformEventForUI);

  // Past events can be used for future "Past Events" section
  // const pastEvents = events
  //   .filter(event => {
  //     if (!event.date) return false;
  //     const eventDate = new Date(event.date);
  //     eventDate.setHours(0, 0, 0, 0);
  //     return eventDate < today;
  //   })
  //   .map(transformEventForUI);

  return (
    <div className="events-page">
      {/* --- HERO SECTION --- */}
      <section
        className="events-hero-section"
        style={{ backgroundImage: `url(${eventsHeroImage})` }}
      >
        <div className="events-hero-overlay"></div>
        <div className="events-hero-content">
          <h1 className="events-hero-title">Upcoming Events</h1>
          <p className="events-hero-description">
            Take part in exclusive events that connect our members with Kuwait's
            industry leaders, professional development resources, and
            transformative career opportunities.
          </p>
        </div>
      </section>

      {/* --- WHY JOIN SECTION --- */}
      <section className="why-join-section">
        <div className="why-join-container">
          <div className="why-join-image-wrapper">
            <img
              src={joinSectionImage}
              alt="A member of Women Kuwait smiling"
              className="why-join-image"
            />
          </div>
          <div className="why-join-content">
            <h2 className="why-join-title">Events to Join</h2>
            <div className="why-join-grid">
              {whyJoinData.map((card, index) => (
                <div className="why-join-card" key={index}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- "NEXT UP" EVENT LISTING SECTION --- */}
      <section className="events-list-section">
        <div className="events-list-container">
          <h2 className="events-list-title">Upcoming Events</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              Loading events...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#dc3545' }}>
              {error}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              No upcoming events at the moment. Check back soon!
            </div>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div 
                  className="event-card upcoming" 
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="event-card-image-container">
                    <img src={event.image} alt={event.title} className="event-card-image" />
                  </div>
                  <div className="event-card-content">
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="event-card-date">{formatEventDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- PAST EVENTS SECTION --- 
      <section className="events-list-section">
        <div className="events-list-container">
          <h2 className="events-list-title">Past Events</h2>
          <div className="events-grid">
            {pastEventsData.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-card-image-container">
                  <img src={event.image} alt={event.title} className="event-card-image" />
                </div>
                <div className="event-card-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-date">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* --- RENDER THE MODAL --- */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default Events;
