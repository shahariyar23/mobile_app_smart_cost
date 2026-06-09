import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Transaction} from '@/types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: {phone: string};
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
  Reports: undefined;
  Insights: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  TransactionEditor: {transaction?: Transaction} | undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
