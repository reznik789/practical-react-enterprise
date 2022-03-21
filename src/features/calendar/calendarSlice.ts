import {
  createSlice,
  ThunkAction,
  Action,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from 'store/reducers';
import { EventType } from 'models/calendar-type';
import axios, { EndPoints } from 'api/axios';

/*typings for the Thunk actions to give us intlelli-sense */
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

/*Shape or types of our CalendarState */
interface CalendarState {
  events: EventType[];
  isModalOpen: boolean;
  selectedEventId?: string | null; //nullable
  selectedRange?: {
    //nullable
    start: number;
    end: number;
  } | null;
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
  },
});

const { setLoading, setError, getEvents: getEventsAction } = slice.actions;

export const getEvents = (): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  dispatch(setError(''));
  try {
    const response = await axios.get<EventType[]>(EndPoints.events);
    dispatch(getEventsAction(response.data));
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default slice.reducer;
