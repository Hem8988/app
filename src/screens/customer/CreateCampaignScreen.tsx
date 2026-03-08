import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

const STEPS = ['Details', 'Screens', 'Media', 'Budget & Pay'];

export default function CreateCampaignScreen({ route, navigation }: any) {
    const [step, setStep] = useState(0);
    const [campaign, setCampaign] = useState<any>(route.params?.campaign || null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    const handleStep1Submit = async () => {
        if (!form.name || !form.start_date || !form.end_date) {
            Alert.alert('Required', 'Please fill all required fields');
            return;
        }
        setLoading(true);
        try {
            const res = await customerApi.saveCampaignStep1(form);
            setCampaign(res.data?.campaign || res.data);
            setStep(1);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to save campaign details');
        } finally { setLoading(false); }
    };

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            {STEPS.map((label, i) => (
                <View key={label} style={styles.progressStep}>
                    <View style={[styles.progressDot, step >= i && styles.progressDotActive, step > i && styles.progressDotDone]}>
                        <Text style={[styles.progressDotText, step >= i && { color: '#fff' }]}>
                            {step > i ? '✓' : i + 1}
                        </Text>
                    </View>
                    <Text style={[styles.progressLabel, step >= i && { color: Colors.primary }]}>{label}</Text>
                    {i < STEPS.length - 1 && (
                        <View style={[styles.progressLine, step > i && styles.progressLineActive]} />
                    )}
                </View>
            ))}
        </View>
    );

    const renderStep0 = () => (
        <ScrollView contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepTitle}>Campaign Details</Text>
            <Text style={styles.stepSubtitle}>Give your campaign a name and schedule</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Campaign Name *</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={t => setForm(f => ({ ...f, name: t }))} placeholder="e.g. Summer Sale 2024" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput style={styles.input} value={form.start_date} onChangeText={t => setForm(f => ({ ...f, start_date: t }))} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>End Date *</Text>
                <TextInput style={styles.input} value={form.end_date} onChangeText={t => setForm(f => ({ ...f, end_date: t }))} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput style={[styles.input, styles.textArea]} value={form.description} onChangeText={t => setForm(f => ({ ...f, description: t }))} placeholder="Brief description of your campaign..." placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} />
            </View>

            <TouchableOpacity style={[styles.nextBtn, loading && { opacity: 0.6 }]} onPress={handleStep1Submit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextBtnText}>Next: Select Screens →</Text>}
            </TouchableOpacity>
        </ScrollView>
    );

    const renderStep1 = () => (
        <ScrollView contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Screens</Text>
            <Text style={styles.stepSubtitle}>Choose the screens where your ad will run</Text>
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>📺 Campaign created! Now browse and add screens from the Browse tab, or use the button below.</Text>
            </View>
            <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Browse')}>
                <Text style={styles.browseBtnText}>Browse Available Screens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
                <Text style={styles.nextBtnText}>Next: Upload Media →</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderStep2 = () => (
        <ScrollView contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepTitle}>Upload Ad Creative</Text>
            <Text style={styles.stepSubtitle}>Upload your image or video advertisement</Text>
            <View style={styles.uploadBox}>
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={styles.uploadTitle}>Upload Media File</Text>
                <Text style={styles.uploadText}>Images (PNG, JPG) or Videos (MP4){'\n'}Max size: 100MB</Text>
                <TouchableOpacity style={styles.uploadBtn}>
                    <Text style={styles.uploadBtnText}>Choose File</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
                <Text style={styles.nextBtnText}>Next: Budget & Payment →</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderStep3 = () => (
        <ScrollView contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepTitle}>Budget & Payment</Text>
            <Text style={styles.stepSubtitle}>Review cost and complete payment</Text>

            {campaign && (
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Campaign</Text><Text style={styles.summaryValue}>{campaign.name}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Duration</Text><Text style={styles.summaryValue}>{campaign.start_date} → {campaign.end_date}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Screens</Text><Text style={styles.summaryValue}>{campaign.screens_count || 0}</Text></View>
                    <View style={[styles.summaryRow, styles.summaryTotal]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{campaign.total_amount || 0}</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.payBtn} onPress={() => Alert.alert('Payment', 'Razorpay integration required')}>
                <Text style={styles.payBtnText}>💳 Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletPayBtn} onPress={() => Alert.alert('Wallet', 'Pay with wallet balance?')}>
                <Text style={styles.walletPayBtnText}>Use Wallet Balance</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 0 ? setStep(s => s - 1) : navigation.goBack()}>
                    <Text style={styles.backText}>← {step > 0 ? 'Back' : 'Cancel'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Campaign</Text>
                <Text style={styles.stepCounter}>{step + 1}/{STEPS.length}</Text>
            </View>
            {renderProgressBar()}
            {steps[step]()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
    backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
    headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
    stepCounter: { fontSize: 13, color: Colors.textMuted },
    progressContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 20, gap: 4 },
    progressStep: { flex: 1, alignItems: 'center', position: 'relative' },
    progressDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.offWhite, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    progressDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    progressDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
    progressDotText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
    progressLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', fontWeight: '600' },
    progressLine: { position: 'absolute', top: 15, left: '60%', right: '-40%', height: 2, backgroundColor: Colors.border },
    progressLineActive: { backgroundColor: Colors.primary },
    stepContent: { padding: 20, paddingBottom: 40 },
    stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
    stepSubtitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 24 },
    field: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.offWhite },
    textArea: { height: 100, textAlignVertical: 'top' },
    nextBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
    nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    infoBox: { backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: 12, padding: 16, marginBottom: 16 },
    infoText: { color: Colors.primary, fontSize: 14, lineHeight: 22 },
    browseBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
    browseBtnText: { color: Colors.primary, fontWeight: '700' },
    uploadBox: { borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 20 },
    uploadIcon: { fontSize: 40, marginBottom: 12 },
    uploadTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    uploadText: { color: Colors.textMuted, textAlign: 'center', fontSize: 13, lineHeight: 20, marginBottom: 16 },
    uploadBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
    uploadBtnText: { color: '#fff', fontWeight: '700' },
    summaryCard: { backgroundColor: Colors.offWhite, borderRadius: 16, padding: 16, marginBottom: 20 },
    summaryTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontSize: 13, color: Colors.textMuted },
    summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.text },
    summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 4 },
    totalLabel: { fontSize: 16, fontWeight: '800', color: Colors.text },
    totalValue: { fontSize: 20, fontWeight: '900', color: Colors.primary },
    payBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
    payBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    walletPayBtn: { backgroundColor: Colors.offWhite, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
    walletPayBtnText: { color: Colors.text, fontWeight: '700' },
});
