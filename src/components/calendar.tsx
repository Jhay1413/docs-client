import React, { useMemo, useCallback, useState } from 'react';
import { Calendar, momentLocalizer, Event, Views, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CustomEvent extends Event {
  title: string;
  start: Date;
  end: Date;
}

const MyCalendar: React.FC = () => {
  const [newEvents, setEvents] = useState<any[]>([]);
  const events: CustomEvent[] = useMemo(() => [
    {
      title: 'Team Meeting',
      start: new Date(2024, 7, 25, 10, 0),
      end: new Date(2024, 7, 25, 11, 0),
    },
    {
      title: 'Lunch Break',
      start: new Date(2024, 7, 25, 12, 0),
      end: new Date(2024, 7, 25, 13, 0),
    },
    {
      title: 'Conference Call',
      start: new Date(2024, 7, 26, 14, 0),
      end: new Date(2024, 7, 26, 15, 0),
    },
  ], []);

  const handleSelectEvent = useCallback((event: CustomEvent) => {
    alert(`Event: ${event.title}`);
  }, []);
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const title = window.prompt('Enter the title for the new event');
    if (title) {
      setEvents([
        ...newEvents,
        {
          title,
          start: slotInfo.start,
          end: slotInfo.end,
          allDay: slotInfo.action === 'doubleClick' ? false : true,
        },
      ]);
    }
  };
  return (
    <div className='absolute w-full h-full '>
      <Calendar
        localizer={localizer} 
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ position: "absolute", height:"100%", width:"100%"}}
        defaultView={Views.MONTH}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default MyCalendar;