import React, { useEffect, useState, useRef } from 'react';
import {
  getEvents,
  openModal,
  closeModal,
  selectEvent,
  selectRange,
  updateEvent,
} from 'features/calendar/calendarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import Page from 'app/components/page';
import { Container, Dialog, Paper, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Header from './Header';
import Toolbar from './Toolbar';
import { EventType, ViewType } from 'models/calendar-type';
import AddEditEventForm from './AddEditEventForm';
import { RoofingTwoTone } from '@mui/icons-material';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import { DateRange, EventClickArg, EventChangeArg } from '@fullcalendar/common';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  calendar: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    '& .fc-unthemed .fc-head': {},
    '& .fc-unthemed .fc-body': {
      backgroundColor: theme.palette.background.default,
    },
    '& .fc-unthemed .fc-row': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed .fc-axis': {
      ...theme.typography.body2,
    },
    '& .fc-unthemed .fc-divider': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed th': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed td.fc-today': {},
    '& .fc-unthemed .fc-highlight': {},
    '& .fc-unthemed .fc-event': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit',
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit',
      },
    },
    '& .fc-unthemed .fc-day-top': {
      ...theme.typography.body2,
    },
    '& .fc-unthemed .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
    },
    '& .fc-unthemed .fc-list-view': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed .fc-list-empty': {
      ...theme.typography.subtitle1,
    },
    '& .fc-unthemed .fc-list-heading td': {
      borderColor: theme.palette.divider,
    },
    '& .fc-unthemed .fc-list-heading-main': {
      ...theme.typography.h6,
    },
    '& .fc-unthemed .fc-list-heading-alt': {
      ...theme.typography.h6,
    },
    '& .fc-unthemed .fc-list-item:hover td': {},
    '& .fc-unthemed .fc-list-item-title': {
      ...theme.typography.body1,
    },
    '& .fc-unthemed .fc-list-item-time': {
      ...theme.typography.body2,
    },
    '& .fc-license-message': {
      display: 'none !important',
    },
  },
}));

const selectedEventSelector = (state: RootState): EventType | null => {
  const { events, selectedEventId } = state.calendar;
  if (!selectedEventId) return null;
  return events?.find(({ id }) => id === selectedEventId) || null;
};

const CalendarView = () => {
  const dispatch = useDispatch();
  const { error, loading, events, isModalOpen, selectedRange } = useSelector(
    (state: RootState) => state.calendar,
  );
  const selectedEvent = useSelector(selectedEventSelector);
  const mobileDevice = useMediaQuery('(max-width:600px)');
  const [date, setDate] = useState<Date>(moment().toDate());
  const [view, setView] = useState<ViewType>(() =>
    mobileDevice ? 'listWeek' : 'dayGridMonth',
  );
  const classes = useStyles();
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    setView(mobileDevice ? 'listWeek' : 'dayGridMonth');
  }, [mobileDevice]);

  const handleAddClick = (): void => {
    dispatch(openModal());
  };

  const handleModalClose = (): void => {
    dispatch(closeModal());
  };

  const handleDateNext = (): void => {
    const calendarEl = calendarRef.current;
    /*the getApi here is part of FullCalendar. If you 'dot space'
    the 'calendarEl,' you'll see the interfaces or APIs available. */
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleDatePrev = (): void => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateToday = (): void => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView: ViewType): void => {
    const calendar = calendarRef.current;
    if (calendar) {
      const calendarApi = calendar.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleEventSelect = ({ event }: EventClickArg): void => {
    dispatch(selectEvent(event.id));
  };

  const handleEventDropOrResize = async ({
    event,
    oldEvent: { title },
  }: EventChangeArg): Promise<void> => {
    try {
      await dispatch(
        updateEvent({
          title,
          allDay: event.allDay,
          start: event.start,
          end: event.end,
          id: event.id,
        } as any),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRangeSelect = ({ start, end }: DateRange): void => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(start, end));
  };

  return (
    <Page className={classes.root} title="Calendar">
      <Container maxWidth={false}>
        <Header onAddClick={handleAddClick} />
        <Toolbar
          date={date}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
          view={view}
        />
        <Paper className={classes.calendar}>
          <FullCalendar
            allDayMaintainDuration
            droppable
            editable
            selectable
            weekends
            dayMaxEventRows
            eventResizableFromStart
            headerToolbar={false}
            select={handleRangeSelect}
            eventClick={handleEventSelect}
            eventDrop={handleEventDropOrResize}
            eventResize={handleEventDropOrResize}
            initialDate={date}
            initialView={view}
            events={events}
            height={800}
            ref={calendarRef}
            rerenderDelay={10}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin,
            ]}
          />
        </Paper>
        <Dialog
          open={isModalOpen}
          fullWidth
          maxWidth="sm"
          onClose={handleModalClose}
        >
          {isModalOpen && (
            <AddEditEventForm
              event={selectedEvent}
              range={selectedRange || null}
              onAddComplete={handleModalClose}
              onCancel={handleModalClose}
              onDeleteComplete={handleModalClose}
              onEditComplete={handleModalClose}
            />
          )}
        </Dialog>
      </Container>
    </Page>
  );
};

export default CalendarView;
