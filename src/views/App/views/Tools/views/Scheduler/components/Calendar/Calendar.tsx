import moment from 'moment';
import { Calendar, DateRange, View, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/sass/styles.scss';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import RdvUserInfoResponseDto from '../../../../../../../../utils/types/RdvUserInfoResponseDto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { useNavigate } from '@tanstack/react-router';

const localizer = momentLocalizer(moment);

const DndCalendar = withDragAndDrop<RdvUserInfoResponseDto, ProfileResponseDto>(Calendar);

const messages = {
  week: 'Semaine',
  work_week: 'Semaine de travail',
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
}>;

export default function AppViewToolsViewSchedulerViewCalendarComponent({
  events,
  views,
  view,
  date,
  onDateChange,
  onViewChange,
}: SchedulerCalendarComponentProps) {
  const navigate = useNavigate({ from: '/app/tools/scheduler' });

  const { data: resources } = useSuspenseQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const onSelectEvent = (event: RdvUserInfoResponseDto) => {
    if (event.rdv) navigate({ to: 'details/$rdvId', params: { rdvId: event.rdv.id }, search: (old) => old, replace: true, resetScroll: false });
  };

  const onEventDrop = ({
    event,
    start,
    end,
    resourceId,
    isAllDay,
  }: {
    event: RdvUserInfoResponseDto;
    start: string | Date;
    end: string | Date;
    resourceId?: string | number;
    isAllDay?: boolean;
  }) => {
    if (!!event.rdv && start instanceof Date && end instanceof Date && (resourceId === undefined || typeof resourceId === 'string'))
      navigate({
        to: 'details/$rdvId/update',
        params: { rdvId: event.rdv.id },
        search: (old) => ({
          ...old,
          dates: [start, end],
          oldParticipant: !resourceId || !event.attributeToId || event.attributeToId === resourceId ? undefined : event.attributeToId,
          newParticipant: !resourceId || !event.attributeToId || resourceId === event.attributeToId ? undefined : resourceId,
          isAllDay: isAllDay ?? false,
        }),
        replace: true,
        resetScroll: false,
      });
  };

  const onSelectSlot = ({ start, end, resourceId }: { start: Date; end: Date; resourceId?: string | number }) => {
    if (typeof resourceId === 'string')
      navigate({ to: 'create', search: (old) => ({ ...old, dates: [start, end], participant: resourceId }), replace: true, resetScroll: false });
  };

  const onEventResize = ({ event, start, end }: { event: RdvUserInfoResponseDto; start: Date | string; end: Date | string }) => {
    if (!!event.rdv && start instanceof Date && end instanceof Date)
      navigate({
        to: 'details/$rdvId/update',
        params: { rdvId: event.rdv.id },
        search: (old) => ({ ...old, dates: [start, end] }),
        replace: true,
        resetScroll: false,
      });
  };

  return (
    <DndCalendar
      culture="fr"
      localizer={localizer}
      formats={formats}
      titleAccessor={(event) => event.rdv?.title ?? ''}
      startAccessor={(event) => moment(event.rdv?.startDateTime).toDate()}
      endAccessor={(event) => moment(event.rdv?.endDatetime).toDate()}
      allDayAccessor={(event) => event.rdv?.fullTime ?? false}
      events={events}
      resources={resources}
      resourceTitleAccessor={(resource) => `${resource.firstName} ${resource.lastName}`}
      resourceIdAccessor={(resource) => resource.id}
      resourceAccessor={(event) => event.attributeToId}
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
      onSelectEvent={onSelectEvent}
      onEventResize={onEventResize}
      onEventDrop={onEventDrop}
      onSelectSlot={onSelectSlot}
      style={{ height: '700px' }}
      selectable
      popup
    />
  );
}
