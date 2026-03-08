import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { Colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

            {/* Background gradient blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoIcon}>
                        <Text style={styles.logoText}>A</Text>
                    </View>
                    <Text style={styles.logoLabel}>
                        AYMRK <Text style={{ color: Colors.primary }}>Manager</Text>
                    </Text>
                </View>

                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>🟢  India's #1 DOOH Platform</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Turn Screens Into{' '}
                        <Text style={styles.heroHighlight}>Income.</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Run ads across India on premium digital screens. Connect your Android TV or advertise on locations nationwide.
                    </Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        {[
                            { value: '500+', label: 'Screens' },
                            { value: '25+', label: 'Cities' },
                            { value: '1000+', label: 'Advertisers' },
                        ].map(stat => (
                            <View key={stat.label} style={styles.stat}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Cards */}
                <View style={styles.cards}>
                    <TouchableOpacity
                        style={[styles.card, styles.cardPrimary]}
                        onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.cardIcon}>📢</Text>
                        <Text style={styles.cardTitle}>Advertiser</Text>
                        <Text style={styles.cardText}>Run targeted campaigns on screens across India</Text>
                        <View style={styles.cardBtn}>
                            <Text style={styles.cardBtnText}>Start Advertising →</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.cardSuccess]}
                        onPress={() => navigation.navigate('RegisterVendor')}>
                        <Text style={styles.cardIcon}>📺</Text>
                        <Text style={styles.cardTitle}>Screen Owner</Text>
                        <Text style={styles.cardText}>List your display and earn passive income daily</Text>
                        <View style={[styles.cardBtn, styles.cardBtnSuccess]}>
                            <Text style={styles.cardBtnText}>List Your Screen →</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* How it works */}
                <View style={styles.howSection}>
                    <Text style={styles.sectionTitle}>How It Works</Text>
                    {[
                        { step: '1', title: 'Create Account', text: 'Sign up in 30 seconds' },
                        { step: '2', title: 'Setup', text: 'Add screens or upload ad creatives' },
                        { step: '3', title: 'Go Live', text: 'Campaigns launch automatically' },
                        { step: '4', title: 'Track & Earn', text: 'Real-time analytics & payouts' },
                    ].map(item => (
                        <View key={item.step} style={styles.stepRow}>
                            <View style={styles.stepBadge}>
                                <Text style={styles.stepNum}>{item.step}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stepTitle}>{item.title}</Text>
                                <Text style={styles.stepText}>{item.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* CTA */}
                <View style={styles.cta}>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginBtnText}>Sign In to Your Account</Text>
                    </TouchableOpacity>
                    <Text style={styles.ctaFooter}>
                        New user?{' '}
                        <Text
                            style={styles.ctaLink}
                            onPress={() => navigation.navigate('Register')}>
                            Create a free account
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },
    blob1: {
        position: 'absolute',
        top: -100,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
    },
    blob2: {
        position: 'absolute',
        bottom: 100,
        left: -100,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(90, 103, 216, 0.1)',
    },
    scroll: { paddingHorizontal: 24, paddingBottom: 48 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 52,
        marginBottom: 40,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    logoText: { color: '#fff', fontSize: 20, fontWeight: '900' },
    logoLabel: { fontSize: 20, fontWeight: '800', color: '#fff' },
    hero: { marginBottom: 36 },
    badge: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 20,
    },
    badgeText: { color: Colors.success, fontSize: 13, fontWeight: '600' },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 44,
        marginBottom: 14,
    },
    heroHighlight: { color: Colors.primary },
    heroSubtitle: {
        fontSize: 16,
        color: Colors.textLight,
        lineHeight: 24,
        marginBottom: 28,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    stat: {},
    statValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
    },
    statLabel: {
        fontSize: 11,
        color: Colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    cards: { flexDirection: 'row', gap: 12, marginBottom: 36 },
    card: {
        flex: 1,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
    },
    cardPrimary: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    cardSuccess: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    cardIcon: { fontSize: 28, marginBottom: 10 },
    cardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 6,
    },
    cardText: {
        fontSize: 12,
        color: Colors.textLight,
        lineHeight: 18,
        marginBottom: 14,
    },
    cardBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
    cardBtnSuccess: { backgroundColor: Colors.success },
    cardBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    howSection: { marginBottom: 36 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
        gap: 14,
    },
    stepBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNum: { color: '#fff', fontWeight: '800', fontSize: 15 },
    stepTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 2 },
    stepText: { color: Colors.textLight, fontSize: 13 },
    cta: { gap: 16 },
    loginBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    ctaFooter: { color: Colors.textLight, textAlign: 'center', fontSize: 14 },
    ctaLink: { color: Colors.primary, fontWeight: '700' },
});
