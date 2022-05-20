import {
  createSlice,
  ThunkAction,
  Action,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from 'store/reducers';
import { EventType } from 'models/calendar-type';
import axios, { EndPoints } from 'api/axios';

export type RangeType = {
  start: number;
  end: number;
};

/*typings for the Thunk actions to give us intlelli-sense */
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

/*Shape or types of our CalendarState */
interface CalendarState {
  events: EventType[];
  isModalOpen: boolean;
  selectedEventId?: string | null; //nullable
  selectedRange?: RangeType | null;
  loading: boolean; //useful for showing spinner or loading screen
  error: string;
}

/*initialState is type-safe, and it must be of a calendar state type.
It also means that you can't add any other types here that are not part
of the calendar state we’ve already defined. */
const initialState: CalendarState = {
  events: [],
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null,
  loading: false,
  error: '',
};

const calendarNamespace = 'calendar';
const slice = createSlice({
  name: calendarNamespace,
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    getEvents: (state, action: PayloadAction<EventType[]>) => {
      state.events = action.payload;
    },
    createEvent: (state, action: PayloadAction<EventType>) => {
      state.events.push(action.payload);
    },
    selectEvent: (state, action: PayloadAction<string>) => {
      state.isModalOpen = true;
      state.selectedEventId = action.payload;
    },
    updateEvent: (state, action: PayloadAction<EventType>) => {
      const index = state.events.findIndex(ev => ev.id === action.payload.id);
      if (index > -1) state.events[index] = action.payload;
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(({ id }) => id !== action.payload);
    },
    selectRange: (state, action: PayloadAction<RangeType>) => {
      state.isModalOpen = true;
      state.selectedRange = {
        ...action.payload,
      };
    },
    openModal: state => {
      state.isModalOpen = true;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

const {
  setLoading,
  setError,
  getEvents: getEventsAction,
  selectRange: selectRangeAction,
  createEvent: createEventAction,
  updateEvent: updateEventAction,
  deleteEvent: deleteEventAction,
} = slice.actions;

export const { selectEvent, openModal, closeModal } = slice.actions;

const createAsyncDispatchCallback =
  dispatch =>
  async (fn, ...args) => {
    dispatch(setLoading(true));
    dispatch(setError(''));
    try {
      await fn(...args);
    } catch (error) {
      console.log(error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getEvents = (): AppThunk => async dispatch => {
  const dispatchAsyncCallback = createAsyncDispatchCallback(dispatch);
  await dispatchAsyncCallback(async () => {
    dispatch(getEventsAction([]));
    const response = await axios.get<EventType[]>(EndPoints.events);
    dispatch(getEventsAction(response.data));
  });
};

export const createEvent =
  (event: EventType): AppThunk =>
  async dispatch => {
    const dispatchAsyncCallback = createAsyncDispatchCallback(dispatch);
    await dispatchAsyncCallback(async (event: EventType) => {
      const { data } = await axios.post<EventType>(EndPoints.events, event);
      dispatch(createEventAction(data));
    }, event);
  };

export const updateEvent =
  (event: EventType): AppThunk =>
  async dispatch => {
    const dispatchAsyncCallback = createAsyncDispatchCallback(dispatch);
    await dispatchAsyncCallback(async (event: EventType) => {
      const { data } = await axios.put(
        `${EndPoints.events}/${event.id}`,
        event,
      );
      dispatch(updateEventAction(data));
    }, event);
  };

export const deleteEvent =
  (id: string): AppThunk =>
  async dispatch => {
    const dispatchAsyncCallback = createAsyncDispatchCallback(dispatch);
    await dispatchAsyncCallback(async (id: string) => {
      const { data } = await axios.put(`${EndPoints.events}/${id}`, id);
      dispatch(deleteEventAction(data));
    }, id);
  };

export const selectRange =
  (start: Date, end: Date): AppThunk =>
  dispatch => {
    dispatch(selectRangeAction({ start: start.getTime(), end: end.getTime() }));
  };

export default slice.reducer;
