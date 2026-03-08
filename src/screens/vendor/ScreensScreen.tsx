import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { vendorApi } from '../../api/vendor';

export default function VendorScreensScreen({ navigation }: any) {
    const [screens, setScreens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try { const res = await vendorApi.getScreens(); setScreens(res.data?.screens || res.data || []); }
        catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const handleToggle = async (screenId: number) => {
        try { await vendorApi.toggleScreen(screenId); load(); } catch { Alert.alert('Error', 'Could not toggle screen status'); }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.screenIcon}><Text style={{ fontSize: 22 }}>📺</Text></View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.screenName}>{item.name}</Text>
                <Text style={styles.location}>📍 {item.city}{item.locality ? `, ${item.locality}` : ''}</Text>
                <View style={styles.metaRow}>
                    <View style={[styles.statusBadge, { backgroundColor: item.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                        <Text style={[styles.statusText, { color: item.is_active ? Colors.success : Colors.danger }]}>{item.is_active ? '● Live' : '● Offline'}</Text>
                    </View>
                    <Text style={styles.price}>₹{item.price_per_day}/day</Text>
                </View>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => navigation.navigate('ScreenDetail', { screenId: item.id })}><Text style={styles.viewBtn}>View</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggle(item.id)} style={[styles.toggleBtn, { backgroundColor: item.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' }]}>
                    <Text style={[styles.toggleText, { color: item.is_active ? Colors.danger : Colors.success }]}>{item.is_active ? 'Off' : 'On'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Screens</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateScreen')}><Text style={styles.addBtnText}>+ Add Screen</Text></TouchableOpacity>
            </View>
            {loading ? <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View> : (
                <FlatList data={screens} keyExtractor={i => String(i.id)} renderItem={renderItem} contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
                    ListEmptyComponent={<View style={styles.empty}><Text style={{ fontSize: 48, marginBottom: 12 }}>📺</Text><Text style={styles.emptyTitle}>No screens yet</Text><TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateScreen')}><Text style={styles.emptyBtnText}>Add Your First Screen</Text></TouchableOpacity></View>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    addBtn: { backgroundColor: Colors.vendorAccent, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    list: { padding: 16, gap: 10 },
    card: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    cardLeft: {},
    screenIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
    cardBody: { flex: 1 },
    screenName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 3 },
    location: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    statusText: { fontSize: 11, fontWeight: '700' },
    price: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
    cardActions: { gap: 6, alignItems: 'center' },
    viewBtn: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
    toggleBtn: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    toggleText: { fontSize: 12, fontWeight: '700' },
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
    emptyBtn: { backgroundColor: Colors.vendorAccent, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
    emptyBtnText: { color: '#fff', fontWeight: '700' },
});
