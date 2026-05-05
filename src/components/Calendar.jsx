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
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const eventStyleGetter = useCallback((event) => {
    const category = event.resource?.category || 'Other';
    const backgroundColor = categoryColors[category] || '#003300';
    const color = textColor[category] || '#ffffffff';

    return {
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: color,
        border: 'none',
        display: 'block'
      }
    };
  }, []);

  const textColor = {
    'Visitation': '#000000ff',
    'Meeting': '#ffffffff',
  };

  const categoryColors = {
    'University Activities': '#003300',
    'Visitation': '#f9dc07',
    'Meeting': '#6e6e6eff',     
    'Photo/Video': '#ff8f33ff',
    'Urgent': '#ff0000ff',
    'Ma\'am Aquessa': '#f354f3ff',
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .rbc-toolbar {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .rbc-toolbar-label {
            font-size: 0.875rem !important;
            padding: 0.5rem 0 !important;
          }
          .rbc-btn-group button {
            font-size: 0.75rem !important;
            padding: 0.25rem 0.5rem !important;
          }
          .rbc-header {
            padding: 0.25rem !important;
            font-size: 0.625rem !important;
          }
          .rbc-event {
            padding: 0.125rem 0.25rem !important;
            font-size: 0.625rem !important;
          }
          .rbc-date-cell {
            padding: 0.125rem !important;
            font-size: 0.75rem !important;
          }
          .rbc-month-view {
            font-size: 0.75rem !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .rbc-header {
            font-size: 0.75rem !important;
          }
          .rbc-event {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
      
      <div className="bg-white p-2 sm:p-4 lg:p-6 mt-4 sm:mt-6 lg:mt-8 rounded-lg shadow-md">
        <div className="h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px] xl:h-[800px]">
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
            views={['month', 'week', 'day', 'agenda']}
            showAllEvents={true}
          />                                      
        </div>
        <DateModal
          ref={modalRef}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </>
  );
};

export default MyCalendar;