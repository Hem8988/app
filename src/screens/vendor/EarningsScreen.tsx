import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { vendorApi } from '../../api/vendor';

export default function VendorEarningsScreen({ navigation }: any) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try { const res = await vendorApi.getEarnings(); setData(res.data); }
        catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const handleWithdraw = async () => {
        const val = parseFloat(amount);
        if (!val || val < 500) { Alert.alert('Minimum withdrawal is ₹500'); return; }
        if (val > (data?.available_balance || 0)) { Alert.alert('Insufficient balance'); return; }
        setWithdrawLoading(true);
        try {
            await vendorApi.requestWithdrawal(val);
            Alert.alert('Success', 'Withdrawal request submitted!');
            setAmount('');
            load();
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed');
        } finally { setWithdrawLoading(false); }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.vendorAccent} /></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}><Text style={styles.headerTitle}>Earnings & Withdrawals</Text></View>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
                {/* Balance cards */}
                <View style={styles.cardsRow}>
                    <View style={[styles.balCard, { backgroundColor: Colors.vendorAccent }]}>
                        <Text style={styles.balLabel}>Total Earned</Text>
                        <Text style={styles.balAmount}>₹{data?.total_earnings || 0}</Text>
                    </View>
                    <View style={[styles.balCard, { backgroundColor: Colors.primary }]}>
                        <Text style={styles.balLabel}>Available</Text>
                        <Text style={styles.balAmount}>₹{data?.available_balance || 0}</Text>
                    </View>
                </View>

                {/* Withdraw form */}
                <View style={styles.withdrawSection}>
                    <Text style={styles.sectionTitle}>Request Withdrawal</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.rupee}>₹</Text>
                            <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Min ₹500" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
                        </View>
                        <TouchableOpacity style={[styles.withdrawBtn, withdrawLoading && { opacity: 0.6 }]} onPress={handleWithdraw} disabled={withdrawLoading}>
                            <Text style={styles.withdrawBtnText}>{withdrawLoading ? '...' : 'Withdraw'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.note}>Funds will be transferred to your registered bank account within 3-5 business days</Text>
                </View>

                {/* Recent earnings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Earnings</Text>
                    {data?.recent_earnings?.length > 0 ? data.recent_earnings.map((e: any) => (
                        <View key={e.id} style={styles.earningRow}>
                            <View>
                                <Text style={styles.earningName}>{e.campaign_name || 'Campaign'}</Text>
                                <Text style={styles.earningDate}>{e.date}</Text>
                            </View>
                            <Text style={styles.earningAmount}>+₹{e.amount}</Text>
                        </View>
                    )) : (
                        <View style={styles.empty}><Text style={styles.emptyText}>No earnings yet</Text></View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    cardsRow: { flexDirection: 'row', gap: 12, padding: 16 },
    balCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
    balLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 6 },
    balAmount: { color: '#fff', fontSize: 24, fontWeight: '900' },
    withdrawSection: { paddingHorizontal: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    inputRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1.5, borderColor: Colors.border },
    rupee: { fontSize: 18, color: Colors.text, fontWeight: '700', marginRight: 6 },
    input: { flex: 1, fontSize: 16, color: Colors.text, paddingVertical: 12 },
    withdrawBtn: { backgroundColor: Colors.vendorAccent, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
    withdrawBtnText: { color: '#fff', fontWeight: '700' },
    note: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
    section: { paddingHorizontal: 16, paddingBottom: 32 },
    earningRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 8 },
    earningName: { fontSize: 13, fontWeight: '600', color: Colors.text },
    earningDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
    earningAmount: { fontSize: 16, fontWeight: '800', color: Colors.success },
    empty: { alignItems: 'center', paddingVertical: 20 },
    emptyText: { color: Colors.textMuted, fontSize: 14 },
});
