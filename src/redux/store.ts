import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import practiceLogsReducer from '../features/practiceLogs/practiceLogsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    practiceLogs: practiceLogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
