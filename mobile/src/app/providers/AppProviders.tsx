import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {navigationRef} from '@/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {store} from '@/store';
import {useAppTheme} from '@/hooks/useAppTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

function NavigationThemeProvider({children}: {children: React.ReactNode}) {
  const theme = useAppTheme();
  const baseTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }}>
      {children}
    </NavigationContainer>
  );
}

export function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationThemeProvider>{children}</NavigationThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
