import React, { useState, useEffect } from 'react';
import { EventType } from '@/types/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface EventCalendarProps {
  events: EventType[];
}

/**
 * EventCalendar component displays events in a monthly calendar view
 * Users can navigate between months and click on dates to see events
 */
const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([]);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Format date to display in a readable format
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  // Check if a date has events
  const hasEvents = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    
    // Filter events for the selected date
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === clickedDate.getDate() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getFullYear() === clickedDate.getFullYear()
      );
    });
    
    setSelectedEvents(filteredEvents);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const hasEventsOnDay = hasEvents(day);
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEventsOnDay ? 'has-events' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasEventsOnDay && <div className="event-indicator"></div>}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="event-calendar-container">
      <div className="calendar-header">
        <h2 className="section-title">Event Calendar</h2>
        <div className="calendar-navigation">
          <button className="nav-button" onClick={goToPreviousMonth}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h3 className="current-month">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button className="nav-button" onClick={goToNextMonth}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>
        
        {generateCalendarDays()}
      </div>
      
      {selectedDate && (
        <div className="selected-date-events">
          <h3 className="selected-date-header">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Events on {formatDate(selectedDate)}
          </h3>
          
          {selectedEvents.length > 0 ? (
            <div className="selected-events-list">
              {selectedEvents.map(event => (
                <div key={event.id} className="selected-event-card">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-time">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                  <p className="event-location">
                    {event.locationType === 'online' ? 'Online Event' : event.location}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events-message">No events scheduled for this date</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
