import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function resetTo(name: string, params?: Record<string, any>) {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({index: 0, routes: [{name, params}]});
}

export function navigate(name: string, params?: Record<string, any>) {
  if (!navigationRef.isReady()) return;
  (navigationRef as any).navigate(name, params);
}

export default {
  navigationRef,
  resetTo,
  navigate,
};
