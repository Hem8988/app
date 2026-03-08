import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { vendorApi } from '../../api/vendor';
import { useAuthStore } from '../../stores/authStore';

export default function VendorDashboardScreen({ navigation }: any) {
    const { user, logout } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try {
            const res = await vendorApi.dashboard();
            setData(res.data);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.vendorAccent} /></View>;

    const stats = [
        { label: 'My Screens', value: data?.total_screens ?? 0, icon: '📺', color: Colors.primary },
        { label: 'Active Campaigns', value: data?.active_campaigns ?? 0, icon: '📢', color: Colors.vendorAccent },
        { label: 'Pending Approval', value: data?.pending_campaigns ?? 0, icon: '⏳', color: Colors.warning },
        { label: 'Total Earnings', value: `₹${data?.total_earnings ?? 0}`, icon: '💰', color: Colors.success },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back 👋</Text>
                    <Text style={styles.username}>{user?.name}</Text>
                </View>
                <View style={styles.onlineDot}><Text style={{ fontSize: 10, color: Colors.success }}>🟢 Online</Text></View>
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
                <View style={styles.statsGrid}>
                    {stats.map(s => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statIcon}>{s.icon}</Text>
                            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={[styles.action, { backgroundColor: 'rgba(59,130,246,0.1)' }]} onPress={() => navigation.navigate('CreateScreen')}>
                            <Text style={styles.actionIcon}>➕</Text><Text style={styles.actionLabel}>Add Screen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.action, { backgroundColor: 'rgba(34,197,94,0.1)' }]} onPress={() => navigation.navigate('Earnings')}>
                            <Text style={styles.actionIcon}>💸</Text><Text style={styles.actionLabel}>Earnings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.action, { backgroundColor: 'rgba(245,158,11,0.1)' }]} onPress={() => navigation.navigate('Campaigns')}>
                            <Text style={styles.actionIcon}>📋</Text><Text style={styles.actionLabel}>Campaigns</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.action, { backgroundColor: 'rgba(139,92,246,0.1)' }]} onPress={() => navigation.navigate('Withdrawals')}>
                            <Text style={styles.actionIcon}>🏦</Text><Text style={styles.actionLabel}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {data?.pending_campaigns > 0 && (
                    <View style={styles.alertCard}>
                        <Text style={styles.alertText}>⚠️ You have {data.pending_campaigns} campaign(s) pending your approval</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Campaigns')}><Text style={styles.alertLink}>Review Now →</Text></TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    greeting: { fontSize: 13, color: Colors.textMuted },
    username: { fontSize: 20, fontWeight: '800', color: Colors.text },
    onlineDot: { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
    statCard: { width: '47%', backgroundColor: Colors.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
    statIcon: { fontSize: 24, marginBottom: 8 },
    statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    actionsRow: { flexDirection: 'row', gap: 10 },
    action: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 8 },
    actionIcon: { fontSize: 22 },
    actionLabel: { fontSize: 11, fontWeight: '700', color: Colors.text, textAlign: 'center' },
    alertCard: { marginHorizontal: 16, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    alertText: { fontSize: 13, color: Colors.warning, flex: 1, marginRight: 10 },
    alertLink: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
});
