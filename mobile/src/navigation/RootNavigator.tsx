import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import {GlobalMicButton} from '@/components/GlobalMicButton';
import {AppText} from '@/components/AppText';
import {AuthStackParamList, MainTabParamList, RootStackParamList} from '@/navigation/types';
import {BudgetScreen} from '@/screens/BudgetScreen';
import {DashboardScreen} from '@/screens/DashboardScreen';
import {LandingScreen} from '@/screens/LandingScreen';
import {GoalsScreen} from '@/screens/GoalsScreen';
import {InsightsScreen} from '@/screens/InsightsScreen';
import {ReportsScreen} from '@/screens/ReportsScreen';
import {SettingsScreen} from '@/screens/SettingsScreen';
import {TransactionEditorScreen} from '@/screens/TransactionEditorScreen';
import {CategoriesScreen} from '@/screens/CategoriesScreen';
import {CategoryDetailsScreen} from '@/screens/CategoryDetailsScreen';
import {TransactionsScreen} from '@/screens/TransactionsScreen';
import {LoginScreen} from '@/screens/auth/LoginScreen';
import {OtpVerificationScreen} from '@/screens/auth/OtpVerificationScreen';
import {RegisterScreen} from '@/screens/auth/RegisterScreen';
import {useAppSelector} from '@/store/hooks';
import {useAppTheme} from '@/hooks/useAppTheme';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  const theme = useAppTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerTitle: 'স্মার্ট কস্ট',
        headerTitleStyle: {fontSize: 24, fontWeight: '700', color: theme.colors.text},
        headerStyle: {backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border, borderBottomWidth: 1, elevation: 2},
        headerRightContainerStyle: {paddingRight: 20},
        headerLeftContainerStyle: {paddingLeft: 20},
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {fontSize: 12, fontWeight: '600'},
      }}>
      <Tabs.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'হোম',
          tabBarIcon: ({color, size}) => <Ionicons name="home" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Transactions" 
        component={TransactionsScreen} 
        options={{
          tabBarLabel: 'লেনদেন',
          tabBarIcon: ({color, size}) => <Ionicons name="shuffle" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Budget" 
        component={BudgetScreen} 
        options={{
          tabBarLabel: 'বাজেট',
          tabBarIcon: ({color, size}) => <Ionicons name="calculator" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Goals" 
        component={GoalsScreen} 
        options={{
          tabBarLabel: 'লক্ষ্য',
          tabBarIcon: ({color, size}) => <Ionicons name="radio-button-on" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{
          tabBarLabel: 'রিপোর্ট',
          tabBarIcon: ({color, size}) => <Ionicons name="stats-chart" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          tabBarLabel: 'ইনসাইট',
          tabBarIcon: ({color, size}) => <Ionicons name="bulb" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarLabel: 'সেটিংস',
          tabBarIcon: ({color, size}) => <Ionicons name="settings" size={size} color={color} />,
        }} 
      />
    </Tabs.Navigator>
  );
}

function AuthenticatedApp() {
  return (
    <>
      <RootStack.Screen name="Main" component={MainTabs} options={{headerShown: false}} />
      <RootStack.Screen
        name="TransactionEditor"
        component={TransactionEditorScreen}
        options={{title: 'লেনদেন', headerShown: false}}
      />
      <RootStack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{title: 'ক্যাটাগরি', headerShown: false}}
      />
      <RootStack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{title: 'ক্যাটাগরি বিস্তারিত', headerShown: false}}
      />
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <>
      <RootStack.Screen name="Landing" component={LandingScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
    </>
  );
}

export function RootNavigator() {
  const token = useAppSelector(state => state.auth.accessToken);

  return (
    <>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {token ? (
          <RootStack.Group>{AuthenticatedApp()}</RootStack.Group>
        ) : (
          <RootStack.Group>{UnauthenticatedApp()}</RootStack.Group>
        )}
      </RootStack.Navigator>
      {token ? <GlobalMicButton /> : null}
    </>
  );
}
