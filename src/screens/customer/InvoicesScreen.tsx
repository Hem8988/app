import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

export default function InvoicesScreen({ navigation }: any) {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try {
            const res = await customerApi.getInvoices();
            setInvoices(res.data?.invoices || res.data || []);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <Text style={styles.invoiceNo}>#{item.invoice_number}</Text>
                <Text style={styles.campaignName} numberOfLines={1}>{item.campaign?.name || 'Campaign'}</Text>
                <Text style={styles.date}>{item.created_at?.split('T')[0]}</Text>
            </View>
            <View style={styles.cardRight}>
                <Text style={styles.amount}>₹{item.amount}</Text>
                <View style={[styles.badge, { backgroundColor: item.status === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'paid' ? Colors.success : Colors.warning }]}>{item.status}</Text>
                </View>
                <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Download', 'PDF download requires server link')}>
                    <Text style={styles.downloadText}>⬇️ PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Invoices</Text>
                <View style={{ width: 40 }} />
            </View>
            {loading ? (
                <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    data={invoices}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
                    ListEmptyComponent={<View style={styles.empty}><Text style={{ fontSize: 36, marginBottom: 8 }}>🧾</Text><Text style={styles.emptyText}>No invoices yet</Text></View>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
    list: { padding: 16, gap: 10 },
    card: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLeft: { flex: 1 },
    invoiceNo: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
    campaignName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    date: { fontSize: 12, color: Colors.textMuted },
    cardRight: { alignItems: 'flex-end', gap: 6 },
    amount: { fontSize: 16, fontWeight: '800', color: Colors.text },
    badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
    badgeText: { fontSize: 11, fontWeight: '700' },
    downloadBtn: { backgroundColor: Colors.offWhite, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
    downloadText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { color: Colors.textMuted, fontSize: 14 },
});
