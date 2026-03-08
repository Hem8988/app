import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

const STATUS_COLORS: Record<string, string> = { active: Colors.success, approved: Colors.success, pending: Colors.warning, rejected: Colors.danger, completed: Colors.primaryLight, draft: Colors.textMuted };

export default function CampaignDetailScreen({ route, navigation }: any) {
    const { campaignId } = route.params;
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customerApi.getCampaign(campaignId).then(res => setCampaign(res.data?.campaign || res.data)).catch(() => { }).finally(() => setLoading(false));
    }, [campaignId]);

    const handleDelete = () => Alert.alert('Delete Campaign', 'Are you sure? This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Delete', style: 'destructive', onPress: async () => {
                try { await customerApi.deleteCampaign(campaignId); navigation.goBack(); } catch { Alert.alert('Error', 'Could not delete campaign'); }
            }
        },
    ]);

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>;
    if (!campaign) return <View style={styles.loader}><Text>Campaign not found</Text></View>;

    const statusColor = STATUS_COLORS[campaign.status] || Colors.textMuted;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{campaign.name}</Text>
                {campaign.status === 'draft' && (
                    <TouchableOpacity onPress={handleDelete}><Text style={{ color: Colors.danger, fontWeight: '700' }}>Delete</Text></TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Status Banner */}
                <View style={[styles.statusBanner, { backgroundColor: statusColor + '15', borderColor: statusColor + '40' }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        ● {campaign.status?.toUpperCase()}
                    </Text>
                    {campaign.rejection_reason && <Text style={styles.rejectionReason}>Reason: {campaign.rejection_reason}</Text>}
                </View>

                {/* Info Cards */}
                {[
                    { label: 'Campaign Name', value: campaign.name, icon: '📢' },
                    { label: 'Schedule', value: `${campaign.start_date} → ${campaign.end_date}`, icon: '📅' },
                    { label: 'Screens', value: `${campaign.screens?.length || 0} screens booked`, icon: '📺' },
                    { label: 'Total Amount', value: `₹${campaign.total_amount || 0}`, icon: '💰' },
                    { label: 'Payment Status', value: campaign.payment_status || 'N/A', icon: '💳' },
                ].map(info => (
                    <View key={info.label} style={styles.infoCard}>
                        <Text style={styles.infoIcon}>{info.icon}</Text>
                        <View><Text style={styles.infoLabel}>{info.label}</Text><Text style={styles.infoValue}>{info.value}</Text></View>
                    </View>
                ))}

                {/* Screens list */}
                {campaign.screens?.length > 0 && (
                    <View style={styles.screensSection}>
                        <Text style={styles.sectionTitle}>Booked Screens</Text>
                        {campaign.screens.map((s: any) => (
                            <View key={s.id} style={styles.screenRow}>
                                <Text style={styles.screenName}>{s.name}</Text>
                                <Text style={styles.screenCity}>📍 {s.city}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Media */}
                {campaign.media_url && (
                    <View style={styles.mediaSection}>
                        <Text style={styles.sectionTitle}>Ad Creative</Text>
                        <View style={styles.mediaBox}><Text style={styles.mediaText}>📁 {campaign.media_type || 'Media'} uploaded</Text></View>
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
    backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
    headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, flex: 1, textAlign: 'center' },
    scroll: { padding: 16, gap: 10 },
    statusBanner: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 4 },
    statusText: { fontSize: 14, fontWeight: '800' },
    rejectionReason: { fontSize: 12, color: Colors.danger, marginTop: 4 },
    infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 12, padding: 14 },
    infoIcon: { fontSize: 22, width: 30 },
    infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
    screensSection: { backgroundColor: Colors.white, borderRadius: 12, padding: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    screenRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
    screenName: { fontSize: 13, fontWeight: '600', color: Colors.text },
    screenCity: { fontSize: 12, color: Colors.textMuted },
    mediaSection: { backgroundColor: Colors.white, borderRadius: 12, padding: 16 },
    mediaBox: { backgroundColor: Colors.offWhite, borderRadius: 10, padding: 16, alignItems: 'center' },
    mediaText: { color: Colors.textMuted, fontSize: 14 },
});
