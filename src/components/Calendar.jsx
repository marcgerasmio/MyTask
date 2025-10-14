import { useState, useRef, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DateModal from './DateModal';
import Supabase from '../Supabase';

const localizer = momentLocalizer(moment);



const MyCalendar = () => {
  const [ActivitiesData, setActivitiesData] = useState([]);
  const modalRef = useRef();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState('');

    const fetchActivities = async () => {
    const { data } = await Supabase.from("activities").select("*");
    setActivitiesData(data);
  };

   useEffect(() => {
      fetchActivities();
    }, []);

  const events = ActivitiesData.map(activity => ({
    id: activity.id,
    title: activity.activityName,
    start: new Date(activity.startDate),
    end: activity.endDate ? new Date(activity.endDate) : new Date(activity.startDate),
    resource: activity 
  }));

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event.resource); 
    modalRef.current?.open();
  }, []);

  const eventStyleGetter = useCallback(() => {
    return {
      style: {
        backgroundColor: '#003300',
        borderRadius: '4px',
        opacity: 0.8,
        color: '#ffffff',
        border: 'none',
        display: 'block'
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          view={currentView}
          date={currentDate}
          onView={setCurrentView}
            onNavigate={date => {
            setCurrentDate(date);
          }}
          popup
          style={{ height: '100%' }}
        />
      </div>
      <DateModal
        ref={modalRef}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default MyCalendar;