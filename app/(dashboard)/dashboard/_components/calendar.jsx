'use client'

import { useState } from 'react';
import { Calendar, momentLocalizer, Navigate, Views } from 'react-big-calendar';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfDay, addHours } from 'date-fns';

const SchedulingCalendar = ({ role, scheduledata }) => {
  const localizer = momentLocalizer(moment);
  const [view, setView] = useState(); // Set initial view to week
  const [date, setDate] = useState(new Date());

  const router = useRouter();

  // Function to parse clinical hours string
  const parseClinicalHours = (hoursString) => {
    switch (hoursString) {
      case '1':
        return '7:00 AM - 3:00 PM';
      case '2':
        return '3:00 PM - 11:00 PM';
      case '3':
        return '11:00 PM - 7:00 AM';
      default:
        return '';
    }
  };

  const events = scheduledata.flatMap((item) =>
  item.dateFrom.map((dateFrom, index) => {
    let startTime, endTime;

    // Set start and end times based on the schedule data value
    switch (item.clinicalHours) {
      case '1':
        startTime = 7;
        endTime = 15;
        break;
      case '2':
        startTime = 15;
        endTime = 23;
        break;
      case '3':
        startTime = 23;
        endTime = 7;
        break;
      default:
        startTime = 0;
        endTime = 0;
        break;
    }

    const eventsInRange = [];

    let currentDate = new Date(dateFrom);
    const endDate = new Date(item.dateTo[index]);
    while (currentDate <= endDate) {
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(startTime, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(endTime, 0, 0);

      // Add the event for the current day to the events array
      eventsInRange.push({
        id: `${item.id}`,
        title: `Area: ${item.clinicalArea?.name} - Clinical Hours: ${parseClinicalHours(item.clinicalHours)}`,
        start: startOfDay,
        end: endOfDay,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eventsInRange;
  })
);

  const flattenedEvents = [].concat(...events);
  const colors = ['#ff9999', '#99ccff', ''];

  let lastColorIndex = 0;

  const eventPropGetter = (event, start, end, isSelected) => {
    const color = colors[lastColorIndex];
    lastColorIndex = (lastColorIndex + 1) % colors.length;

    return {
      style: {
        backgroundColor: color, 
        borderColor: color, 
        // backgroundColor: `rgba(${hexToRgb(color)}, 0.7)`, // Adjust the alpha value (opacity)
      },
    };
  };


  const handleSelectEvent = (event) => {
    if (role !== 'Student') {
      router.push(`/schedule/${event.id}`);
    }
    if (role === 'Student') {
      router.push(`/schedule`);
    }
  };


  return (
    <div className='h-[600px] bg-white w-full my-4 mb-15'>

      <Calendar
        localizer={localizer}
        events={flattenedEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        showMultiDayTimes
        onSelectEvent={(event) => handleSelectEvent(event)}
        defaultView='month'
        date={date}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate, newView, action) => {
          setDate(newDate);
        }}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default SchedulingCalendar;
