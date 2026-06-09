import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import preferencesReducer from '@/store/slices/preferencesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
