import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { customerApi } from '../../api/customer';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../theme/colors';

export default function VendorProfileScreen() {
    const { user, logout } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We'll reuse the customer profile API since the user object comes back the same way,
        // or typically we'd use vendorApi.getProfile()
        customerApi.getProfile().then(res => {
            setProfile(res.data?.user || res.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.vendorAccent} /></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.avatarSection}>
                    <View style={[styles.avatar, { backgroundColor: Colors.vendorAccent }]}>
                        <Text style={styles.avatarText}>{(user?.name || 'V')[0].toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={styles.roleBadge}><Text style={styles.roleText}>📺 Screen Owner</Text></View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Logout', style: 'destructive', onPress: logout }])}>
                    <Text style={styles.logoutText}>🚪 Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    scroll: { paddingBottom: 40 },
    avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: Colors.white, marginBottom: 16 },
    avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
    userName: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    userEmail: { fontSize: 13, color: Colors.textMuted, marginBottom: 10 },
    roleBadge: { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
    roleText: { color: Colors.vendorAccent, fontWeight: '700', fontSize: 12 },
    logoutBtn: { marginHorizontal: 16, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: 'rgba(239,68,68,0.05)' },
    logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 15 },
});
