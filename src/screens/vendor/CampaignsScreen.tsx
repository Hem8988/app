import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { vendorApi } from '../../api/vendor';

export default function VendorCampaignsScreen({ navigation }: any) {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try { const res = await vendorApi.getCampaigns(); setCampaigns(res.data?.campaigns || res.data || []); }
        catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const STATUS_COLOR: Record<string, string> = { pending: Colors.warning, approved: Colors.success, rejected: Colors.danger, active: Colors.success, completed: Colors.primaryLight };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}>
            <View style={styles.cardTop}>
                <Text style={styles.campaignName} numberOfLines={1}>{item.campaign?.name || item.name}</Text>
                <View style={[styles.badge, { backgroundColor: (STATUS_COLOR[item.status] || Colors.textMuted) + '20' }]}>
                    <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] || Colors.textMuted }]}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.meta}>👤 {item.campaign?.customer?.name || item.customer_name || 'Advertiser'}</Text>
            <Text style={styles.meta}>📅 {item.start_date} → {item.end_date}</Text>
            {item.status === 'pending' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.approveBtn} onPress={() => {
                        vendorApi.approveCampaign(item.id).then(load).catch(() => Alert.alert('Error', 'Could not approve'));
                    }}>
                        <Text style={styles.approveBtnText}>✓ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => {
                        Alert.prompt?.('Reason', 'Why are you rejecting?', (reason) => {
                            vendorApi.rejectCampaign(item.id, reason || 'Rejected').then(load).catch(() => { });
                        });
                    }}>
                        <Text style={styles.rejectBtnText}>✗ Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}><Text style={styles.headerTitle}>Campaigns</Text></View>
            {loading ? <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View> : (
                <FlatList data={campaigns} keyExtractor={i => String(i.id)} renderItem={renderItem} contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
                    ListEmptyComponent={<View style={styles.empty}><Text style={{ fontSize: 36 }}>📋</Text><Text style={styles.emptyText}>No campaigns on your screens yet</Text></View>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    list: { padding: 16, gap: 10 },
    card: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    campaignName: { fontSize: 14, fontWeight: '700', color: Colors.text, flex: 1, marginRight: 10 },
    badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
    approveBtn: { flex: 1, backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.vendorAccent },
    approveBtnText: { color: Colors.vendorAccent, fontWeight: '700' },
    rejectBtn: { flex: 1, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.danger },
    rejectBtnText: { color: Colors.danger, fontWeight: '700' },
    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { color: Colors.textMuted, fontSize: 14 },
});
