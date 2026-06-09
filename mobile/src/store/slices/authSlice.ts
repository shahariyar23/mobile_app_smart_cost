import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '@/types';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{user: User; accessToken: string}>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials: state => {
      state.user = null;
      state.accessToken = null;
    },
    setHydrated: state => {
      state.isHydrated = true;
    },
  },
});

export const {setCredentials, clearCredentials, setHydrated} = authSlice.actions;
export default authSlice.reducer;
