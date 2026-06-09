import React from 'react';
import {AppProviders} from '@/app/providers/AppProviders';
import {RootNavigator} from '@/navigation/RootNavigator';

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
