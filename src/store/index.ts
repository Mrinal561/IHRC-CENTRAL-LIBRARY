import { configureStore } from '@reduxjs/toolkit';
import authReduce from './features/auth/authSlice';
import authSlice from './features/Auth/authSlice';

 const store = configureStore({
  reducer: {
    auth: authReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;