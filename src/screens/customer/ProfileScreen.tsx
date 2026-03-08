import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, TextInput } from 'react-native';
import { customerApi } from '../../api/customer';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../theme/colors';

export default function CustomerProfileScreen() {
    const { user, logout } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        customerApi.getProfile().then(res => {
            const p = res.data?.user || res.data;
            setProfile(p);
            setForm({ name: p?.name || '', phone: p?.phone || '' });
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await customerApi.updateProfile(form);
            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch { Alert.alert('Error', 'Failed to update profile'); } finally { setSaving(false); }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text></View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={styles.roleBadge}><Text style={styles.roleText}>📢 Advertiser</Text></View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Personal Info</Text>
                        <TouchableOpacity onPress={() => setEditing(!editing)}>
                            <Text style={styles.editLink}>{editing ? 'Cancel' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>

                    {editing ? (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} value={form.name} onChangeText={t => setForm(f => ({ ...f, name: t }))} />
                            <Text style={styles.label}>Phone</Text>
                            <TextInput style={styles.input} value={form.phone} onChangeText={t => setForm(f => ({ ...f, phone: t }))} keyboardType="phone-pad" />
                            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoList}>
                            {[
                                { label: 'Full Name', value: profile?.name, icon: '👤' },
                                { label: 'Email', value: profile?.email, icon: '📧' },
                                { label: 'Phone', value: profile?.phone || 'Not set', icon: '📱' },
                                { label: 'Member Since', value: profile?.created_at?.split('T')[0] || 'N/A', icon: '📅' },
                            ].map(item => (
                                <View key={item.label} style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>{item.icon}</Text>
                                    <View><Text style={styles.infoLabel}>{item.label}</Text><Text style={styles.infoValue}>{item.value}</Text></View>
                                </View>
                            ))}
                        </View>
                    )}
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
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
    userName: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    userEmail: { fontSize: 13, color: Colors.textMuted, marginBottom: 10 },
    roleBadge: { backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
    roleText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
    section: { backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
    editLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
    infoList: { gap: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoIcon: { fontSize: 20, width: 28 },
    infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
    formGroup: { gap: 12 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.text },
    input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: Colors.text, backgroundColor: Colors.offWhite },
    saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    logoutBtn: { marginHorizontal: 16, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: 'rgba(239,68,68,0.05)' },
    logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 15 },
});
