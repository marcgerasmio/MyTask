import React, { useState } from 'react';
import moment from 'moment';
import { myEvents } from '../lib/data';

const getEventsForDay = (date) => {
  return myEvents.filter(event =>
    moment(event.start).isSame(date, 'day')
  );
};

const MyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const startOfMonth = currentMonth.clone().startOf('month');
  const endOfMonth = currentMonth.clone().endOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = endOfMonth.clone().endOf('week');

  const days = [];
  let day = startDate.clone();

  while (day.isBefore(endDate, 'day')) {
    days.push(day.clone());
    day.add(1, 'day');
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePrevMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, 'month'));

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-2 py-1 bg-gray-200 rounded">Prev</button>
        <h2 className="text-lg font-bold">{currentMonth.format('MMMM YYYY')}</h2>
        <button onClick={handleNextMonth} className="px-2 py-1 bg-gray-200 rounded">Next</button>
      </div>
 <table className="w-full border-collapse table-fixed">
  <thead>
    <tr>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <th key={d} className="border p-2 text-center bg-gray-100 w-1/7">{d}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {weeks.map((week, i) => (
      <tr key={i}>
        {week.map(day => {
          const isCurrentMonth = day.month() === currentMonth.month();
          const events = getEventsForDay(day);
          return (
            <td
              key={day.format('YYYY-MM-DD')}
              className={`border p-2 align-top w-1/7 ${isCurrentMonth ? '' : 'bg-gray-50 text-gray-400'}`}
              style={{ minWidth: '80px', maxWidth: '120px' }}
            >
              <div className="font-bold">{day.date()}</div>
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="mt-1 text-xs bg-blue-100 rounded px-1 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ textOverflow: 'ellipsis', display: 'block' }}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default MyCalendar;