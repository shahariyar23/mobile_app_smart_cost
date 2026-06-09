import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type PreferencesState = {
  themeMode: 'system' | 'light' | 'dark';
};

const initialState: PreferencesState = {
  themeMode: 'system',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<PreferencesState['themeMode']>) => {
      state.themeMode = action.payload;
    },
  },
});

export const {setThemeMode} = preferencesSlice.actions;
export default preferencesSlice.reducer;
