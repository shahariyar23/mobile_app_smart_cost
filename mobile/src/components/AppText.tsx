import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = TextProps & {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  weight?: 'regular' | 'semibold' | 'bold';
  muted?: boolean;
};

const sizes: Record<NonNullable<Props['variant']>, TextStyle> = {
  title: {fontSize: 28, lineHeight: 36},
  subtitle: {fontSize: 20, lineHeight: 28},
  body: {fontSize: 16, lineHeight: 24},
  caption: {fontSize: 13, lineHeight: 18},
};

const weights: Record<NonNullable<Props['weight']>, TextStyle['fontWeight']> = {
  regular: '400',
  semibold: '600',
  bold: '700',
};

export function AppText({
  variant = 'body',
  weight = 'regular',
  muted,
  style,
  ...props
}: Props) {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        sizes[variant],
        {color: muted ? theme.colors.muted : theme.colors.text, fontWeight: weights[weight]},
        style,
      ]}
    />
  );
}
