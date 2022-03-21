/* Combine all reducers in this file and export the combined reducers.
combineReducers - turns an object whose values are different reducer
functions into a single reducer function. */
import { combineReducers } from '@reduxjs/toolkit';
import calendarReducer from 'features/calendar/calendarSlice';
import themeReducer from 'styles/theme/slice';
/* combineReducers requires an object.we're using the spread operator (...
injectedReducers) to spread out all the Reducers */
const rootReducer = combineReducers({
  calendar: calendarReducer,
  theme: themeReducer,
});
/* RooState is the type or shape of the combinedReducer easier way of
getting all the types from this rootReducer instead of mapping it one
by one. RootState - we can use the Selector to give us intelli-sense in
building our components. */
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
