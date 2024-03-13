import moment from 'moment';
import { Calendar, DateRange, View, momentLocalizer } from 'react-big-calendar';
import RdvUserInfoResponseDto from '../../utils/types/RdvUserInfoResponseDto';
import 'react-big-calendar/lib/sass/styles.scss';

const localizer = momentLocalizer(moment);

const messages = {
  week: 'Semaine',
  work_week: 'Semaine',
  day: 'Jour',
  month: 'Mois',
  previous: 'Précédent',
  next: 'Suivant',
  today: `Aujourd'hui`,
  agenda: 'Agenda',
  allDay: 'Toute la journée',
  noEventsInRange: "Pas d'évènement",
  showMore: (total: number) => `+${total} plus`,
};

const formats = {
  dayHeaderFormat: (date: Date) => localizer.format(date, 'ddd D MMM', 'fr'),
  dayRangeHeaderFormat: ({ start, end }: DateRange) => localizer.format(start, 'ddd D MMM', 'fr') + ' - ' + localizer.format(end, 'ddd D MMM', 'fr'),
};

const minDate = new Date(0, 0, 0, 8, 0, 0);
const maxDate = new Date(0, 0, 0, 18, 0, 0);
const nowDate = new Date();

const eventPropGetter = (event: RdvUserInfoResponseDto, start: Date, end: Date) => {
  let backColor = '#F24C52';
  switch (event.rdv?.place) {
    case 'Extérieur':
      backColor = '#FFA500';
      break;
    case 'Maladie':
      backColor = 'red';
      break;
    case 'Congés':
      backColor = 'purple';
      break;
    case 'Absence':
      backColor = 'red';
      break;
    case 'Férié':
      backColor = 'red';
      break;
    case 'RdV Téléphonique':
    case 'VIZEO':
    case 'Show room':
      backColor = 'green';
      break;
    default:
      break;
  }
  return {
    ...{
      style: {
        backgroundColor: backColor,
        borderColor: backColor,
        color: 'white',
        fontSize: '13px',
        fontFamily: 'DIN2014',
      },
    },
    ...(moment(new Date()).isSame(moment(start), 'day') &&
      moment(new Date()).hour() >= moment(start).hour() &&
      moment(new Date()).hour() <= moment(end).hour() && {
        style: {
          backgroundColor: '#31385A',
          borderColor: '#31385A',
          fontSize: '13px',
          color: 'white',
          fontFamily: 'din-regular',
        },
      }),
  };
};

type SchedulerCalendarComponentProps = Readonly<{
  events: Array<RdvUserInfoResponseDto>;
  views: Array<View>;
  view: View;
  date: Date;
  onViewChange: (view: View) => void;
  onDateChange: (date: Date) => void;
  onEventClick: (event: RdvUserInfoResponseDto) => void;
}>;

export default function SchedulerCalendarComponent({ events, views, view, date, onDateChange, onViewChange, onEventClick }: SchedulerCalendarComponentProps) {
  return (
    <Calendar
      culture="fr"
      localizer={localizer}
      formats={formats}
      titleAccessor={(event) => event.rdv?.title ?? ''}
      startAccessor={(event) => moment(event.rdv?.startDateTime).toDate()}
      endAccessor={(event) => moment(event.rdv?.endDatetime).toDate()}
      allDayAccessor={(event) => event.rdv?.fullTime ?? false}
      events={events}
      messages={messages}
      min={minDate}
      max={maxDate}
      defaultDate={nowDate}
      eventPropGetter={eventPropGetter}
      view={view}
      date={date}
      views={views}
      onNavigate={onDateChange}
      onView={onViewChange}
      onSelectEvent={onEventClick}
    />
  );
}
