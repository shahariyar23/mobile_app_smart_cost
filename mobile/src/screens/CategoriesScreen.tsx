import React, {useMemo, useState} from 'react';
import {StyleSheet, View, RefreshControl, FlatList, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';
import {AppInput} from '@/components/AppInput';
import {EmptyState} from '@/components/EmptyState';
import {Screen} from '@/components/Screen';
import {CategoryCard} from '@/components/category/CategoryCard';
import {CategorySummaryCards} from '@/components/category/CategorySummaryCards';
import {CreateCategoryModal} from '@/components/category/CreateCategoryModal';
import {VoiceCategoryModal} from '@/components/category/VoiceCategoryModal';
import {useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory} from '@/hooks/useCategories';
import {useCategoryVoiceCommand} from '@/hooks/useCategoryVoiceCommand';
import {useTransactions} from '@/hooks/useTransactions';
import {PRESET_ICONS} from '@/components/category/IconPicker';
import {PRESET_COLORS} from '@/components/category/ColorPicker';
import {useAppTheme} from '@/hooks/useAppTheme';
import {Category} from '@/api/categories';
import {RootStackScreenProps} from '@/navigation/types';

export function CategoriesScreen({navigation}: RootStackScreenProps<'Categories'>) {
  const theme = useAppTheme();
  
  const {data: categories = [], isLoading, refetch, isRefetching} = useCategories();
  const {data: transactions = []} = useTransactions({type: 'all'});
  
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const voiceCommand = useCategoryVoiceCommand();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'default' | 'custom'>('all');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const stats = useMemo(() => {
    const map = new Map<string, {count: number, amount: number}>();
    transactions.forEach(t => {
      const catName = t.category;
      if (!map.has(catName)) map.set(catName, {count: 0, amount: 0});
      const current = map.get(catName)!;
      current.count += 1;
      current.amount += t.amount;
    });
    return map;
  }, [transactions]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'income' ? c.type === 'income' :
        filter === 'expense' ? c.type === 'expense' : true; // default/custom not strictly defined in backend yet
      
      return matchesSearch && matchesFilter;
    });
  }, [categories, search, filter]);

  const totalIncome = categories.filter(c => c.type === 'income').length;
  const totalExpense = categories.filter(c => c.type === 'expense').length;

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDelete = (category: Category) => {
    deleteCategory.mutate(category.id);
  };

  const handleSave = (payload: any) => {
    if (editingCategory) {
      updateCategory.mutate({id: editingCategory.id, payload}, {
        onSuccess: () => setModalVisible(false)
      });
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => setModalVisible(false)
      });
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  const handleVoiceConfirm = () => {
    if (voiceCommand.draft) {
      createCategory.mutate(
        {
          name: voiceCommand.draft.name,
          type: voiceCommand.draft.type,
          icon: PRESET_ICONS[0],
          color: PRESET_COLORS[0],
        },
        {onSuccess: voiceCommand.clearDraft}
      );
    }
  };

  const handleVoiceEdit = () => {
    if (voiceCommand.draft) {
      setEditingCategory({
        id: 0,
        name: voiceCommand.draft.name,
        type: voiceCommand.draft.type,
        icon: null,
        color: null,
      });
      voiceCommand.clearDraft();
      setModalVisible(true);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border}]}>
        <View style={styles.headerTop}>
           <Pressable onPress={() => navigation.goBack()} style={{padding: 4, marginRight: 8}}>
             <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
           </Pressable>
           <View style={{flex: 1}}>
             <AppText variant="title" weight="bold">ক্যাটাগরি</AppText>
             <AppText muted variant="caption">আপনার আয় ও ব্যয়ের ক্যাটাগরিগুলো পরিচালনা করুন</AppText>
           </View>
           <Pressable 
             onPress={voiceCommand.isListening ? voiceCommand.stop : voiceCommand.start} 
             style={[styles.micButton, {backgroundColor: voiceCommand.isListening ? theme.colors.danger : theme.colors.surfaceAlt}]}
           >
             <Ionicons name="mic" size={20} color={voiceCommand.isListening ? '#fff' : theme.colors.primary} />
           </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={{marginHorizontal: -20}}>
              <CategorySummaryCards total={categories.length} income={totalIncome} expense={totalExpense} />
            </View>
            <View style={styles.filtersContainer}>
              <AppInput 
                label=""
                placeholder="Search category..." 
                value={search} 
                onChangeText={setSearch} 
              />
              <View style={styles.chips}>
                {['all', 'income', 'expense'].map((f) => (
                  <Pressable 
                    key={f} 
                    onPress={() => setFilter(f as any)}
                    style={[
                      styles.chip, 
                      {backgroundColor: filter === f ? theme.colors.primary : theme.colors.surfaceAlt}
                    ]}
                  >
                    <AppText style={{color: filter === f ? '#fff' : theme.colors.text, fontSize: 12}}>
                      {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expense'}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{padding: 20}}>
               <EmptyState 
                 title="কোনো ক্যাটাগরি পাওয়া যায়নি" 
                 message="আপনার প্রথম ক্যাটাগরি তৈরি করুন" 
               />
            </View>
          ) : null
        }
        renderItem={({item}) => {
          const stat = stats.get(item.name) || {count: 0, amount: 0};
          return (
            <View style={{paddingHorizontal: 20}}>
              <CategoryCard 
                category={item} 
                transactionCount={stat.count} 
                totalAmount={stat.amount}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPress={() => navigation.navigate('CategoryDetails', {categoryId: item.id})}
                onLongPress={handleEdit}
              />
            </View>
          );
        }}
      />

      <Pressable 
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={openCreateModal}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <CreateCategoryModal 
        visible={modalVisible} 
        category={editingCategory}
        saving={createCategory.isPending || updateCategory.isPending}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
      />

      <VoiceCategoryModal
        draft={voiceCommand.draft}
        saving={createCategory.isPending}
        onCancel={voiceCommand.clearDraft}
        onConfirm={handleVoiceConfirm}
        onEdit={handleVoiceEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  listHeader: {
    gap: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 4},
  },
});
