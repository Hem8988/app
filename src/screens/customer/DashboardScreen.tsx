import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../stores/authStore';
import { customerApi } from '../../api/customer';

export default function CustomerDashboardScreen({ navigation }: any) {
    const { user, logout } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadDashboard = async () => {
        try {
            const res = await customerApi.dashboard();
            setData(res.data);
        } catch {
            // handle error
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadDashboard(); }, []);

    const onRefresh = () => { setRefreshing(true); loadDashboard(); };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const stats = [
        { label: 'Total Campaigns', value: data?.total_campaigns ?? 0, icon: '📢', color: Colors.primary },
        { label: 'Active Now', value: data?.active_campaigns ?? 0, icon: '🟢', color: Colors.success },
        { label: 'Pending Approval', value: data?.pending_campaigns ?? 0, icon: '⏳', color: Colors.warning },
        { label: 'Wallet Balance', value: `₹${data?.wallet_balance ?? 0}`, icon: '💳', color: Colors.primaryDark },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good {getTimeGreeting()} 👋</Text>
                    <Text style={styles.username}>{user?.name}</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn} onPress={() => { }}>
                    <Text style={styles.notifIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map(stat => (
                        <View key={stat.label} style={styles.statCard}>
                            <Text style={styles.statIcon}>{stat.icon}</Text>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionItem, { backgroundColor: 'rgba(59,130,246,0.1)' }]}
                            onPress={() => navigation.navigate('Browse')}>
                            <Text style={styles.actionIcon}>🔍</Text>
                            <Text style={styles.actionLabel}>Browse Screens</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionItem, { backgroundColor: 'rgba(34,197,94,0.1)' }]}
                            onPress={() => navigation.navigate('CreateCampaign')}>
                            <Text style={styles.actionIcon}>➕</Text>
                            <Text style={styles.actionLabel}>New Campaign</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionItem, { backgroundColor: 'rgba(245,158,11,0.1)' }]}
                            onPress={() => navigation.navigate('Wallet')}>
                            <Text style={styles.actionIcon}>💳</Text>
                            <Text style={styles.actionLabel}>Add Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionItem, { backgroundColor: 'rgba(139,92,246,0.1)' }]}
                            onPress={() => navigation.navigate('Invoices')}>
                            <Text style={styles.actionIcon}>🧾</Text>
                            <Text style={styles.actionLabel}>Invoices</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Campaigns */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Campaigns</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Campaigns')}>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>

                    {data?.recent_campaigns?.length > 0 ? (
                        data.recent_campaigns.map((campaign: any) => (
                            <TouchableOpacity
                                key={campaign.id}
                                style={styles.campaignCard}
                                onPress={() => navigation.navigate('CampaignDetail', { campaignId: campaign.id })}>
                                <View style={styles.campaignLeft}>
                                    <Text style={styles.campaignName} numberOfLines={1}>{campaign.name}</Text>
                                    <Text style={styles.campaignMeta}>
                                        📺 {campaign.screens_count || 0} screens
                                        {'  '}📅 {campaign.start_date} — {campaign.end_date}
                                    </Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
                                        {campaign.status}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📢</Text>
                            <Text style={styles.emptyTitle}>No campaigns yet</Text>
                            <Text style={styles.emptyText}>Create your first ad campaign to start reaching customers</Text>
                            <TouchableOpacity
                                style={styles.emptyBtn}
                                onPress={() => navigation.navigate('Browse')}>
                                <Text style={styles.emptyBtnText}>Browse Screens</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
}

function getStatusColor(status: string) {
    const map: Record<string, string> = {
        active: Colors.success,
        approved: Colors.success,
        pending: Colors.warning,
        rejected: Colors.danger,
        completed: Colors.primaryLight,
        draft: Colors.textMuted,
    };
    return map[status?.toLowerCase()] || Colors.textMuted;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
        backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    greeting: { fontSize: 13, color: Colors.textMuted },
    username: { fontSize: 20, fontWeight: '800', color: Colors.text },
    notifBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center',
    },
    notifIcon: { fontSize: 18 },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 12,
        padding: 16,
    },
    statCard: {
        width: '47%', backgroundColor: Colors.white, borderRadius: 16,
        padding: 16, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    statIcon: { fontSize: 24, marginBottom: 8 },
    statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    statLabel: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    seeAll: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
    actionsRow: { flexDirection: 'row', gap: 10 },
    actionItem: {
        flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 8,
    },
    actionIcon: { fontSize: 22 },
    actionLabel: { fontSize: 11, fontWeight: '700', color: Colors.text, textAlign: 'center' },
    campaignCard: {
        backgroundColor: Colors.white, borderRadius: 14, padding: 14,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    campaignLeft: { flex: 1, marginRight: 12 },
    campaignName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
    campaignMeta: { fontSize: 12, color: Colors.textMuted },
    statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    emptyState: {
        backgroundColor: Colors.white, borderRadius: 16, padding: 32,
        alignItems: 'center',
    },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 6 },
    emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    emptyBtn: {
        backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24,
    },
    emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
