import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

const STATUS_COLORS: Record<string, string> = {
    active: Colors.success, approved: Colors.success,
    pending: Colors.warning, rejected: Colors.danger,
    completed: Colors.primaryLight, draft: Colors.textMuted,
};

export default function CampaignsScreen({ navigation }: any) {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try {
            const res = await customerApi.getCampaigns();
            setCampaigns(res.data?.campaigns || res.data || []);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}>
            <View style={styles.cardTop}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: (STATUS_COLORS[item.status] || Colors.textMuted) + '20' }]}>
                    <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] || Colors.textMuted }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <View style={styles.cardMeta}>
                <Text style={styles.metaText}>📺 {item.screens_count || 0} screens</Text>
                <Text style={styles.metaText}>📅 {item.start_date} → {item.end_date}</Text>
                <Text style={styles.metaText}>💰 ₹{item.total_amount || 0}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Campaigns</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateCampaign')}>
                    <Text style={styles.addBtnText}>+ New</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    data={campaigns}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={{ fontSize: 48, marginBottom: 12 }}>📢</Text>
                            <Text style={styles.emptyTitle}>No campaigns yet</Text>
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Browse')}>
                                <Text style={styles.emptyBtnText}>Browse Screens to Start</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    addBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16, gap: 12 },
    card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardName: { fontSize: 15, fontWeight: '700', color: Colors.text, flex: 1, marginRight: 10 },
    badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    cardMeta: { gap: 4 },
    metaText: { fontSize: 12, color: Colors.textMuted },
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
    emptyBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
    emptyBtnText: { color: '#fff', fontWeight: '700' },
});
