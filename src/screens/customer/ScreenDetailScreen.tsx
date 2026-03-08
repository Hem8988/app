import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

export default function ScreenDetailScreen({ route, navigation }: any) {
    const { screenId } = route.params;
    const [screen, setScreen] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customerApi.screenDetail(screenId).then(res => setScreen(res.data?.screen || res.data)).catch(() => { }).finally(() => setLoading(false));
    }, [screenId]);

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>;
    if (!screen) return <View style={styles.loader}><Text>Screen not found</Text></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero image */}
                <View style={styles.imageSection}>
                    {screen.image ? (
                        <Image source={{ uri: screen.image }} style={styles.heroImage} />
                    ) : (
                        <View style={[styles.heroImage, styles.imagePlaceholder]}>
                            <Text style={{ fontSize: 60 }}>📺</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.screenName}>{screen.name}</Text>
                        {screen.is_active && <View style={styles.activeBadge}><Text style={styles.activeText}>🟢 Active</Text></View>}
                    </View>
                    <Text style={styles.location}>📍 {screen.city}{screen.locality ? `, ${screen.locality}` : ''}{screen.address ? ` — ${screen.address}` : ''}</Text>

                    {/* Specs */}
                    <View style={styles.specsGrid}>
                        {[
                            { label: 'Type', value: screen.screen_type || 'N/A', icon: '📺' },
                            { label: 'Size', value: screen.screen_size || 'N/A', icon: '📐' },
                            { label: 'Resolution', value: screen.resolution || 'N/A', icon: '🔲' },
                            { label: 'Daily Footfall', value: screen.daily_footfall || 'N/A', icon: '👥' },
                        ].map(s => (
                            <View key={s.label} style={styles.specCard}>
                                <Text style={styles.specIcon}>{s.icon}</Text>
                                <Text style={styles.specValue}>{s.value}</Text>
                                <Text style={styles.specLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Pricing */}
                    <View style={styles.pricingSection}>
                        <Text style={styles.sectionTitle}>Pricing</Text>
                        <View style={styles.priceCard}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Per Day</Text>
                                <Text style={styles.priceValue}>₹{screen.price_per_day || 0}</Text>
                            </View>
                            {screen.price_per_week && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Per Week</Text>
                                    <Text style={styles.priceValue}>₹{screen.price_per_week}</Text>
                                </View>
                            )}
                            {screen.price_per_month && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Per Month</Text>
                                    <Text style={styles.priceValue}>₹{screen.price_per_month}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {screen.description && (
                        <View style={styles.descSection}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.descText}>{screen.description}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerPrice}>₹{screen.price_per_day}/day</Text>
                    <Text style={styles.footerSub}>Best for campaigns</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('CreateCampaign', { selectedScreen: screen })}>
                    <Text style={styles.bookBtnText}>Book This Screen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageSection: { position: 'relative' },
    heroImage: { width: '100%', height: 260 },
    imagePlaceholder: { backgroundColor: Colors.offWhite, justifyContent: 'center', alignItems: 'center' },
    backBtn: { position: 'absolute', top: 48, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    content: { padding: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    screenName: { fontSize: 22, fontWeight: '800', color: Colors.text, flex: 1, marginRight: 10 },
    activeBadge: { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    activeText: { color: Colors.success, fontSize: 11, fontWeight: '700' },
    location: { fontSize: 14, color: Colors.textMuted, marginBottom: 20 },
    specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    specCard: { width: '47%', backgroundColor: Colors.offWhite, borderRadius: 12, padding: 14, alignItems: 'center' },
    specIcon: { fontSize: 22, marginBottom: 6 },
    specValue: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    specLabel: { fontSize: 11, color: Colors.textMuted },
    pricingSection: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    priceCard: { backgroundColor: Colors.offWhite, borderRadius: 12, padding: 16, gap: 10 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
    priceLabel: { fontSize: 14, color: Colors.textMuted },
    priceValue: { fontSize: 15, fontWeight: '800', color: Colors.primary },
    descSection: { marginBottom: 100 },
    descText: { fontSize: 14, color: Colors.textMuted, lineHeight: 22 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: Colors.border },
    footerPrice: { fontSize: 22, fontWeight: '900', color: Colors.text },
    footerSub: { fontSize: 11, color: Colors.textMuted },
    bookBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
    bookBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
