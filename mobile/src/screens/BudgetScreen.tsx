import React, {useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ScrollView, View, StyleSheet, useColorScheme, RefreshControl} from 'react-native';
import {
  useCurrentBudget,
  useBudgetSummary,
  useBudgetScore,
  useBudgetRecommendation,
  useBudgetAlerts,
  useCheckBudgetAlerts,
  useBudgetAnalytics,
  useBudgetHistory
} from '@/hooks/useBudgets';
import {Screen} from '@/components/Screen';
import {AppText} from '@/components/AppText';
import {BudgetOverviewCard} from '@/components/budget/BudgetOverviewCard';
import {BudgetHealthCard} from '@/components/budget/BudgetHealthCard';
import {CategoryBudgetCards} from '@/components/budget/CategoryBudgetCards';
import {SmartAlertsSection} from '@/components/budget/SmartAlertsSection';
import {DailyRecommendationCard} from '@/components/budget/DailyRecommendationCard';
import {BudgetAnalyticsSection} from '@/components/budget/BudgetAnalyticsSection';
import {BudgetHistorySection} from '@/components/budget/BudgetHistorySection';
import {CreateBudgetModal} from '@/components/budget/CreateBudgetModal';
import {VoiceBudgetModal} from '@/components/budget/VoiceBudgetModal';
import {EmptyBudgetState} from '@/components/budget/EmptyBudgetState';
import {FloatingActionButton} from '@/components/budget/FloatingActionButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  sectionSpacing: {
    marginTop: 28,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});



export function BudgetScreen() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentBudgetQuery = useCurrentBudget();
  const currentBudget = currentBudgetQuery.data;

  const summaryQuery = useBudgetSummary(currentBudget?.id);
  const scoreQuery = useBudgetScore();
  const recommendationQuery = useBudgetRecommendation(currentBudget?.id);
  const alertsQuery = useBudgetAlerts();
  const analyticsQuery = useBudgetAnalytics();
  const historyQuery = useBudgetHistory();
  
  const checkAlerts = useCheckBudgetAlerts();

  const isDark = colorScheme === 'dark';
  const themeColors = isDark 
    ? {bg: '#0F1419', surface: '#1A1F2E', text: '#FFFFFF', textMuted: '#9CA3AF'}
    : {bg: '#FFFFFF', surface: '#F9FAFB', text: '#111827', textMuted: '#6B7280'};

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      currentBudgetQuery.refetch(),
      summaryQuery.refetch(),
      scoreQuery.refetch(),
      recommendationQuery.refetch(),
      alertsQuery.refetch(),
      analyticsQuery.refetch(),
      historyQuery.refetch(),
    ]);
    if (currentBudget?.id) {
       checkAlerts.mutate(currentBudget.id);
    }
    setRefreshing(false);
  };

  const handleCreateBudget = () => {
    setShowCreateModal(false);
  };

  const handleVoiceInput = () => {
    setShowVoiceModal(false);
  };

  if (currentBudgetQuery.isLoading) {
    return <Screen><View style={[styles.container, {backgroundColor: themeColors.bg}]} /></Screen>;
  }

  if (!currentBudget) {
    return (
      <Screen>
        <ScrollView
          style={[styles.container, {backgroundColor: themeColors.bg}]}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <EmptyBudgetState
            onCreateBudget={() => setShowCreateModal(true)}
            onVoiceInput={() => setShowVoiceModal(true)}
          />
        </ScrollView>

        <FloatingActionButton
          onMicPress={() => setShowVoiceModal(true)}
          onPlusPress={() => setShowCreateModal(true)}
        />

        <CreateBudgetModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateBudget}
        />

        <VoiceBudgetModal
          visible={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onSuccess={handleVoiceInput}
        />
      </Screen>
    );
  }

  const summary = summaryQuery.data;
  const score = scoreQuery.data;
  const recommendation = recommendationQuery.data;
  
  // Map backend BudgetAlerts to the frontend Alert format
  const mappedAlerts = (alertsQuery.data || []).map(a => {
    let type: 'warning' | 'danger' | 'info' = 'info';
    let icon = 'bulb';
    if (a.alert_type === 'warning') {
      type = 'warning';
      icon = 'warning';
    } else if (a.alert_type === 'exceeded') {
      type = 'warning';
      icon = 'alert-circle';
    } else if (a.alert_type === 'overspent') {
      type = 'danger';
      icon = 'alert-circle';
    }
    return {
      type,
      icon,
      message: a.message,
    };
  });

  return (
    <Screen>
      <ScrollView
        style={[styles.container, {backgroundColor: themeColors.bg}]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="title" weight="bold" style={styles.title}>
            বাজেট
          </AppText>
          <AppText style={[styles.subtitle, {color: themeColors.textMuted}]}>
            {new Date().toLocaleDateString('bn-BD', {
              month: 'long',
              year: 'numeric',
            })}
          </AppText>
        </View>

        {/* Budget Overview Card */}
        <BudgetOverviewCard
          totalBudget={summary?.budget.amount || 0}
          spent={summary?.spent_amount || 0}
          remaining={summary?.remaining_amount || 0}
          usagePercent={summary?.utilization_percentage || 0}
          isDark={isDark}
        />

        {/* Budget Health Section */}
        <View style={styles.sectionSpacing}>
          <AppText style={[styles.sectionTitle, {color: themeColors.text}]}>
            আর্থিক স্বাস্থ্য
          </AppText>
        </View>
        <BudgetHealthCard 
          score={score?.score || 0} 
          status={score?.status || 'অজানা'} 
          isDark={isDark} 
        />

        {/* Daily Recommendation */}
        <DailyRecommendationCard
          remaining={recommendation?.remaining_budget || 0}
          daysLeft={recommendation?.remaining_days || 0}
          dailyRecommendation={recommendation?.daily_recommendation || 0}
          isDark={isDark}
        />

        {/* Smart Alerts */}
        {mappedAlerts.length > 0 && (
          <>
            <View style={styles.sectionSpacing}>
              <AppText style={[styles.sectionTitle, {color: themeColors.text}]}>
                স্মার্ট সতর্কতা
              </AppText>
            </View>
            <SmartAlertsSection alerts={mappedAlerts} isDark={isDark} />
          </>
        )}

        {/* Category Budgets */}
        <View style={styles.sectionSpacing}>
          <AppText style={[styles.sectionTitle, {color: themeColors.text}]}>
            ক্যাটাগরি বাজেট
          </AppText>
        </View>
        <CategoryBudgetCards isDark={isDark} />

        {/* Budget Analytics */}
        <View style={[styles.sectionSpacing, {marginTop: 32}]}>
          <AppText style={[styles.sectionTitle, {color: themeColors.text}]}>
            বিশ্লেষণ
          </AppText>
        </View>
        <BudgetAnalyticsSection analytics={analyticsQuery.data} isDark={isDark} />

        {/* Budget History */}
        <View style={styles.sectionSpacing}>
          <AppText style={[styles.sectionTitle, {color: themeColors.text}]}>
            ইতিহাস
          </AppText>
        </View>
        <BudgetHistorySection history={historyQuery.data} isDark={isDark} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <FloatingActionButton
        onMicPress={() => setShowVoiceModal(true)}
        onPlusPress={() => setShowCreateModal(true)}
      />

      {/* Modals */}
      <CreateBudgetModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateBudget}
      />

      <VoiceBudgetModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSuccess={handleVoiceInput}
      />
    </Screen>
  );
}
