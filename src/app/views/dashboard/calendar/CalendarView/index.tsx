import React, { useEffect } from 'react';
import { getEvents } from 'features/calendar/calendarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

const CalendarView = () => {
  const dispatch = useDispatch();
  const { error, loading, events } = useSelector(
    (state: RootState) => state.calendar,
  );

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  return (
    <div>
      <h3>Calendar</h3>
      {error && <p>Some error occurred</p>}
      {loading && <p>...Loading</p>}
      {events && events.length > 0 && (
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarView;
