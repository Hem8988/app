import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

export default function WalletScreen() {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [topupLoading, setTopupLoading] = useState(false);

    useEffect(() => {
        customerApi.getWallet().then(res => setWallet(res.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleTopup = async () => {
        const val = parseFloat(amount);
        if (!val || val < 100) { Alert.alert('Minimum top-up is ₹100'); return; }
        setTopupLoading(true);
        try {
            const res = await customerApi.createWalletOrder(val);
            // In production: open Razorpay with res.data.order_id
            Alert.alert('Payment Gateway', 'Razorpay integration required. Order created: ' + res.data?.order_id);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to create order');
        } finally { setTopupLoading(false); }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>;

    const balance = wallet?.balance || 0;
    const transactions = wallet?.transactions || [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Wallet</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>₹{parseFloat(balance).toFixed(2)}</Text>
                    <Text style={styles.balanceSub}>Use your wallet balance to pay for campaigns</Text>
                </View>

                <View style={styles.topupSection}>
                    <Text style={styles.sectionTitle}>Add Money</Text>
                    <View style={styles.amountRow}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter amount (min ₹100)"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                        <TouchableOpacity style={[styles.topupBtn, topupLoading && { opacity: 0.6 }]} onPress={handleTopup} disabled={topupLoading}>
                            <Text style={styles.topupBtnText}>{topupLoading ? '...' : 'Add Money'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.quickAmounts}>
                        {['500', '1000', '2000', '5000'].map(v => (
                            <TouchableOpacity key={v} style={styles.quickChip} onPress={() => setAmount(v)}>
                                <Text style={styles.quickChipText}>₹{v}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.txnSection}>
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    {transactions.length > 0 ? transactions.map((txn: any) => (
                        <View key={txn.id} style={styles.txnRow}>
                            <View style={[styles.txnIcon, { backgroundColor: txn.type === 'credit' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                                <Text>{txn.type === 'credit' ? '⬆️' : '⬇️'}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.txnDesc}>{txn.description || txn.type}</Text>
                                <Text style={styles.txnDate}>{txn.created_at}</Text>
                            </View>
                            <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? Colors.success : Colors.danger }]}>
                                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                            </Text>
                        </View>
                    )) : (
                        <View style={styles.emptyTxn}>
                            <Text style={{ fontSize: 36, marginBottom: 8 }}>💳</Text>
                            <Text style={styles.emptyTxnText}>No transactions yet</Text>
                        </View>
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
    balanceCard: { margin: 16, borderRadius: 20, padding: 28, background: Colors.primary, backgroundColor: Colors.primary, alignItems: 'center' },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
    balanceAmount: { color: '#fff', fontSize: 40, fontWeight: '900', marginBottom: 8 },
    balanceSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
    topupSection: { paddingHorizontal: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 14 },
    amountRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1.5, borderColor: Colors.border },
    rupeeSymbol: { fontSize: 18, color: Colors.text, fontWeight: '700', marginRight: 6 },
    input: { flex: 1, fontSize: 16, color: Colors.text, paddingVertical: 12 },
    topupBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
    topupBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    quickAmounts: { flexDirection: 'row', gap: 8 },
    quickChip: { flex: 1, backgroundColor: Colors.white, borderRadius: 10, paddingVertical: 8, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
    quickChipText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
    txnSection: { paddingHorizontal: 16, paddingBottom: 32 },
    txnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 8 },
    txnIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    txnDesc: { fontSize: 13, fontWeight: '600', color: Colors.text },
    txnDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
    txnAmount: { fontSize: 15, fontWeight: '800' },
    emptyTxn: { alignItems: 'center', paddingVertical: 32 },
    emptyTxnText: { color: Colors.textMuted, fontSize: 14 },
});
