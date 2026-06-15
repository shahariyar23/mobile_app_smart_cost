import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type ToastStatus = 'success' | 'error';

type Props = {
  message: string;
  status?: ToastStatus;
};

export function Toast({message, status = 'success'}: Props) {
  const theme = useAppTheme();
  const backgroundColor = status === 'success' ? theme.colors.success : theme.colors.danger;
  const borderColor = status === 'success' ? theme.colors.success : theme.colors.danger;

  return (
    <View style={[styles.container, {backgroundColor, borderColor}]}>      
      <AppText weight="semibold" style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    top: 16,
    right: '50%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
  },
});
