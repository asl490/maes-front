import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.html',
})
export class Calendar {
  options: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left:   'prev,next today',
      center: 'title',
      right:  'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    editable: true,
    selectable: true,
    weekends: true,
    height: 'auto',
    events: [
      { title: 'Team Meeting',      date: '2025-04-21', color: '#9D2449' },
      { title: 'Product Launch',    date: '2025-04-23', color: '#621132' },
      { title: 'Design Review',     start: '2025-04-22T10:00:00', end: '2025-04-22T12:00:00', color: '#c9a87a' },
      { title: 'Sprint Planning',   date: '2025-04-28', color: '#9D2449' },
      { title: 'Client Call',       start: '2025-04-25T14:00:00', end: '2025-04-25T15:00:00', color: '#621132' },
      { title: 'Code Review',       date: '2025-04-30', color: '#c9a87a' },
      { title: 'Release v2.1',      date: '2025-05-05', color: '#9D2449' },
      { title: 'Quarterly Review',  date: '2025-05-10', color: '#621132' },
    ],
  };
}
