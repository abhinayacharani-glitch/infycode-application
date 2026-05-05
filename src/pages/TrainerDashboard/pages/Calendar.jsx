import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  X,
  Edit2,
  Trash2,
  Check,
  CheckCircle,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import {
  getCalendarEventsAPI,
  createCalendarEventAPI,
  updateCalendarEventAPI,
  deleteCalendarEventAPI
} from '../../../services/api';
import './Calendar.css';


const EVENT_TYPES = [
  { id: 'meeting', label: 'Admin Interaction', color: '#F472B6', bg: '#FFF1F2' },
  { id: 'counselling', label: 'Counselling', color: '#10B981', bg: '#ECFDF5' },
  { id: 'training', label: 'Training', color: '#8B5CF6', bg: '#F5F3FF' }
];



const formatTo12Hr = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('Month');

  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState({
    meeting: true, counselling: true, training: true
  });



  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [hoveredDate, setHoveredDate] = useState(null);
  const [navDirection, setNavDirection] = useState(''); // 'left' or 'right' for animation

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    type: 'meeting',
    meetingLink: '',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getCalendarEventsAPI();
      if (res.success) {
        setEvents(res.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };


  // --- LOGIC: CALENDAR GENERATION ---
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    const result = [];
    // Prev month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    // Current month days
    for (let i = 1; i <= days; i++) {
      result.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    // Next month days
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      result.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return result;
  }, [currentDate]);

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const handleNavigate = (direction) => {
    setNavDirection(direction === 'prev' ? 'slide-right' : 'slide-left');
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setMonth(currentDate.getMonth() - 1);
    else if (direction === 'next') newDate.setMonth(currentDate.getMonth() + 1);
    else if (direction === 'today') newDate.setTime(new Date().getTime());

    // Clear animation class after transition
    setTimeout(() => setNavDirection(''), 400);
    setCurrentDate(newDate);
  };
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.type.toLowerCase().includes(searchQuery.toLowerCase());
      const isVisible = visibleTypes[e.type];
      return matchesSearch && isVisible;
    });
  }, [events, searchQuery, visibleTypes]);

  const handleEditClick = (event) => {
    setNewEvent({
      id: event.id,
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
      meetingLink: event.meetingLink || '',
      description: event.description || ''
    });
    setIsEditing(true);
    setShowCreateModal(true);
    setSelectedEvent(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let res;
      if (isEditing) {
        res = await updateCalendarEventAPI(newEvent.id, newEvent);
      } else {
        res = await createCalendarEventAPI(newEvent);
      }

      if (res.success) {
        await fetchEvents();
        setShowCreateModal(false);
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        setNewEvent({
          title: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '11:00',
          type: 'meeting',
          meetingLink: '',
          description: ''
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert(error.message || "Failed to save event");
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteEvent = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        const res = await deleteCalendarEventAPI(id);
        if (res.success) {
          setEvents(events.filter(e => e.id !== id));
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };


  const getEventsForDate = (date) => {
    // Use local YYYY-MM-DD format to match database dates exactly
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return filteredEvents.filter(e => e.date === dateStr);
  };


  return (
    <div className="v3-calendar-page-container">
      <header className="v3-page-header">
        <h1>Calendar</h1>
        <p>Manage your meetings, trainings and counseling here</p>
      </header>

      <div className="v3-calendar-layout">
        {/* 1. INTERNAL SIDEBAR */}
        <aside className="v3-cal-sidebar">
          <div className="v3-mini-calendar">
            <div className="mini-cal-header">
              <div className="mini-cal-title-group">
                <span className="mini-cal-title">{monthLabel}</span>
                <button className="mini-today-btn" onClick={() => handleNavigate('today')}>Today</button>
              </div>
              <div className="mini-cal-nav">
                <button className="mini-nav-btn" onClick={() => handleNavigate('prev')}><ChevronLeft size={16} /></button>
                <button className="mini-nav-btn" onClick={() => handleNavigate('next')}><ChevronRight size={16} /></button>
              </div>
            </div>

            <div className={`mini-cal-content ${navDirection}`}>
              <div className="mini-cal-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="mini-day-label">{d}</div>)}
                {daysInMonth.map((d, i) => {
                  const isToday = d.date.toDateString() === new Date().toDateString();
                  const isSelected = d.date.toDateString() === currentDate.toDateString();
                  const dateEvents = getEventsForDate(d.date);

                  return (
                    <div
                      key={i}
                      className={`mini-date-cell ${d.isCurrentMonth ? '' : 'hidden-month'} ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''}`}
                      onClick={() => setCurrentDate(d.date)}
                      onMouseEnter={() => setHoveredDate(d.date.toDateString())}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      <span className="mini-date-num">{d.date.getDate()}</span>
                      {d.isCurrentMonth && dateEvents.length > 0 && (
                        <div className="mini-event-dots">
                          {dateEvents.slice(0, 3).map((_, idx) => (
                            <span key={idx} className="mini-dot"></span>
                          ))}
                        </div>
                      )}

                      {hoveredDate === d.date.toDateString() && dateEvents.length > 0 && (
                        <div className="mini-cal-tooltip">
                          {dateEvents.map(ev => (
                            <div key={ev.id} className="tooltip-event">
                              <span className={`type-indicator ${ev.type}`}></span>
                              {ev.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="v3-cal-filters">
            <span className="filter-title">My Calendars</span>
            {EVENT_TYPES.map(type => (
              <div
                key={type.id}
                className={`filter-item ${visibleTypes[type.id] ? 'active' : ''}`}
                onClick={() => {
                  setVisibleTypes({ ...visibleTypes, [type.id]: !visibleTypes[type.id] });
                }}
                style={{ '--cat-color': type.color }}
              >
                <div className="filter-checkbox">
                  {visibleTypes[type.id] && <Check size={12} color="white" />}
                </div>
                <span className="filter-label">{type.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* 2. MAIN CONTENT */}
        <main className="v3-cal-main">
          {/* ENHANCED GOOGLE CALENDAR HEADER */}
          <header className="v3-cal-page-header">
            <div className="v3-header-left">
              <h1>📅 Calendar</h1>
            </div>

            <div className="v3-header-center">
              <button className="mini-nav-btn" onClick={() => handleNavigate('prev')}><ChevronLeft size={20} /></button>
              <span className="current-month-label">{monthLabel}</span>
              <button className="mini-nav-btn" onClick={() => handleNavigate('next')}><ChevronRight size={20} /></button>
            </div>

            <div className="v3-header-right">
              <button className="v3-add-event-btn" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} />
                <span>Add Event</span>
              </button>

              <div className="v3-search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="settings-wrapper">
                <button className="v3-icon-btn" onClick={() => setShowSettings(!showSettings)}>
                  <Settings size={18} />
                </button>

                {showSettings && (
                  <div className="v3-settings-dropdown">
                    <div className="dropdown-header">Visibility</div>
                    {EVENT_TYPES.map(type => (
                      <div
                        key={type.id}
                        className="dropdown-item"
                        onClick={() => setVisibleTypes({ ...visibleTypes, [type.id]: !visibleTypes[type.id] })}
                      >
                        <div className={`check-box ${visibleTypes[type.id] ? 'checked' : ''}`} style={{ '--bg': type.color }}>
                          {visibleTypes[type.id] && <Check size={10} color="white" />}
                        </div>
                        <span>Show {type.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CALENDAR VIEW */}
          <div className="v3-cal-view-container">
            <div className="v3-month-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="v3-day-header">{day}</div>
              ))}
              {daysInMonth.map((d, i) => {
                const dayEvents = getEventsForDate(d.date);
                const isToday = d.date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={i}
                    className={`v3-month-cell ${isToday ? 'today' : ''} ${!d.isCurrentMonth ? 'other-month' : ''}`}
                  >
                    <div className="cell-header">
                      <span className="date-num">{d.date.getDate()}</span>
                    </div>
                      <div className="event-pills-wrap">
                        {dayEvents.slice(0, 4).map(event => {
                          const isCompleted = new Date(`${event.date}T${event.endTime}`) < new Date();
                          
                          return (
                            <div
                              key={event.id}
                              className={`event-pill ${event.type} ${isCompleted ? 'completed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCompleted) return;
                                
                                if (event.type === 'meeting' && event.meetingLink) {
                                  window.open(event.meetingLink, '_blank');
                                } else if (event.type === 'training') {
                                  navigate('/trainer-dashboard/materials');
                                } else if (event.type === 'counselling') {
                                  navigate('/trainer-dashboard/counselling');
                                }
                              }}
                              title={
                                isCompleted ? "Event Completed" :
                                event.type === 'meeting' ? "Join Teams Meeting" :
                                event.type === 'training' ? "Go to Materials" :
                                event.type === 'counselling' ? "Go to Counselling" :
                                event.title
                              }
                            >
                              <span 
                                className="event-time" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                                title="View Details"
                              >
                                {isCompleted ? <CheckCircle size={10} className="completed-check" /> : formatTo12Hr(event.startTime)}
                              </span>
                              <span className="event-title">{event.title}</span>
                              {!isCompleted && event.meetingLink && <LinkIcon size={10} className="pill-link-icon" />}
                            </div>
                          );
                        })}
                        {dayEvents.length > 4 && (
                          <div className="more-indicator">+{dayEvents.length - 4} more</div>
                        )}
                      </div>
                  </div>
                );
              })}
            </div>

            {/* EVENT DETAILS POPUP */}
            {selectedEvent && (() => {
              const isHappened = new Date(`${selectedEvent.date}T${selectedEvent.endTime}`) < new Date();
              return (
                <div className="v3-details-popup" style={{ top: '100px', left: '50%', transform: 'translateX(-50%)' }}>
                  <div className="popup-header">
                    <span className={`popup-type-tag ${selectedEvent.type}`} style={{ background: EVENT_TYPES.find(t => t.id === selectedEvent.type).bg, color: EVENT_TYPES.find(t => t.id === selectedEvent.type).color }}>
                      {selectedEvent.type}
                    </span>
                    {isHappened && (
                      <span className="happened-badge">
                        <CheckCircle size={12} />
                        Event Happened
                      </span>
                    )}
                    <button className="close-btn" onClick={() => setSelectedEvent(null)}><X size={16} /></button>
                  </div>
                  <h3 className="popup-title">{selectedEvent.title}</h3>
                  <div className="popup-info-row">
                    <CalendarIcon size={14} />
                    <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="popup-info-row">
                    <Clock size={14} />
                    <span>{formatTo12Hr(selectedEvent.startTime)} - {formatTo12Hr(selectedEvent.endTime)}</span>
                  </div>
                  {selectedEvent.description && (
                    <div className="popup-desc">{selectedEvent.description}</div>
                  )}
                  <div className="popup-actions">
                    <button className="action-btn" onClick={() => handleEditClick(selectedEvent)} title="Edit"><Edit2 size={14} /></button>
                    <button className="action-btn delete" onClick={() => handleDeleteEvent(selectedEvent.id)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })()}
          </div>
        </main>

        {/* CREATE EVENT MODAL */}
        {showCreateModal && (
          <div className="v3-modal-overlay">
            <div className="v3-modal-content premium">
              <div className="v3-modal-header">
                <h2>{isEditing ? 'Edit Event' : 'Schedule New Event'}</h2>
                <button className="v3-close-btn" onClick={() => { setShowCreateModal(false); setIsEditing(false); }}>
                  <X size={20} />
                </button>
              </div>
              <div className="v3-divider"></div>

              <form onSubmit={handleCreateEvent}>
                <div className="v3-form-body">
                  <div className="v3-form-group">
                    <label>Event Title</label>
                    <div className="v3-input-wrapper">
                      <Edit2 size={16} className="v3-field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Project Review Meeting"
                        required
                        value={newEvent.title}
                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="v3-form-group">
                    <label>Event Type</label>
                    <div className="type-pill-group">
                      {EVENT_TYPES.map(t => {
                        const isDisabled = t.id !== 'meeting';
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`type-pill ${newEvent.type === t.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => !isDisabled && setNewEvent({ ...newEvent, type: t.id })}
                            style={{ 
                              '--pill-color': t.color,
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              opacity: isDisabled ? 0.5 : 1
                            }}
                            disabled={isDisabled}
                            title={isDisabled ? "Only Admin Interaction is allowed" : ""}
                          >
                            <span className="pill-dot"></span>
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>



                  <div className="v3-form-row">
                    <div className="v3-form-group">
                      <label>Meeting Link (Optional)</label>
                      <div className="v3-input-wrapper">
                        <LinkIcon size={16} className="v3-field-icon" />
                        <input
                          type="url"
                          placeholder="Paste Link"
                          value={newEvent.meetingLink}
                          onChange={e => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="v3-form-group">
                      <label>Date</label>
                      <div className="v3-input-wrapper">
                        <CalendarIcon size={16} className="v3-field-icon" />
                        <input
                          type="date"
                          required
                          value={newEvent.date}
                          onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="v3-form-row">
                    <div className="v3-form-group">
                      <label>Start Time</label>
                      <div className="v3-input-wrapper">
                        <Clock size={16} className="v3-field-icon" />
                        <input
                          type="time"
                          required
                          value={newEvent.startTime}
                          onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="v3-form-group">
                      <label>End Time</label>
                      <div className="v3-input-wrapper">
                        <Clock size={16} className="v3-field-icon" />
                        <input
                          type="time"
                          required
                          value={newEvent.endTime}
                          onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="v3-modal-footer">
                  <button type="button" className="v3-cancel-btn" onClick={() => { setShowCreateModal(false); setIsEditing(false); }}>
                    Cancel
                  </button>
                  <button type="submit" className={`v3-save-btn ${isSaving ? 'loading' : ''}`} disabled={isSaving}>
                    {isSaving ? (isEditing ? 'Updating...' : 'Scheduling...') : (isEditing ? 'Update Event' : 'Save Event')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUCCESS TOAST */}
        <div className={`v3-success-toast ${showToast ? 'show' : ''}`}>
          <div className="toast-content">
            <Check size={16} className="toast-icon" />
            <span>Event {isEditing ? 'updated' : 'scheduled'} successfully!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
