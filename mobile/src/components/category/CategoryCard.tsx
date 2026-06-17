import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';
import {Category} from '@/api/categories';
import {formatTaka} from '@/utils/currency';

type Props = {
  category: Category;
  transactionCount: number;
  totalAmount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onPress: (category: Category) => void;
  onLongPress: (category: Category) => void;
};

export function CategoryCard({
  category,
  transactionCount,
  totalAmount,
  onEdit,
  onDelete,
  onPress,
  onLongPress,
}: Props) {
  const theme = useAppTheme();
  const color = category.color || theme.colors.primary;
  const isIncome = category.type === 'income';

  const renderLeftActions = () => {
    return (
      <View style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}>
        <Ionicons name="pencil" size={24} color="#fff" />
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.actionButton, {backgroundColor: theme.colors.danger}]}>
        <Ionicons name="trash" size={24} color="#fff" />
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') onEdit(category);
        else if (direction === 'right') onDelete(category);
      }}
    >
      <Pressable
        onPress={() => onPress(category)}
        onLongPress={() => onLongPress(category)}
        style={({pressed}) => [
          styles.card,
          {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.9 : 1},
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={(category.icon as any) || 'list'} size={24} color={color} />
          </View>
          <View style={styles.info}>
            <AppText weight="bold" style={{fontSize: 16}}>{category.name}</AppText>
            <AppText muted variant="caption">{isIncome ? 'আয়' : 'খরচ'} ক্যাটাগরি</AppText>
          </View>
          <View style={[styles.colorDot, {backgroundColor: color}]} />
        </View>

        <View style={styles.footer}>
          <AppText muted variant="caption">{transactionCount} টি লেনদেন</AppText>
          <AppText weight="bold" style={{color: isIncome ? theme.colors.success : theme.colors.danger}}>
            {formatTaka(totalAmount)} {isIncome ? 'আয়' : 'খরচ'}
          </AppText>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderRadius: 12,
  },
});
