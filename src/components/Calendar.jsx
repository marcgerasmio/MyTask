import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { myEvents } from '../lib/data';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);


const MyCalendar = () => {
  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
    <Calendar
      localizer={localizer}
      events={myEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
  );
};

export default MyCalendar;
