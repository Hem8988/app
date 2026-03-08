import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { authApi } from '../../api/auth';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authApi.forgotPassword(email.trim().toLowerCase());
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.successContainer}>
                    <Text style={styles.successIcon}>📧</Text>
                    <Text style={styles.successTitle}>Check Your Email</Text>
                    <Text style={styles.successText}>
                        We've sent a password reset link to{'\n'}<Text style={{ fontWeight: '700' }}>{email}</Text>
                    </Text>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.btnText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.icon}>🔐</Text>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your registered email address and we'll send you a password reset link.
                </Text>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        placeholder="you@example.com"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={t => { setEmail(t); setError(''); }}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <TouchableOpacity
                    style={[styles.btn, loading && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scroll: { paddingHorizontal: 24, paddingBottom: 40 },
    backBtn: { paddingTop: 52, marginBottom: 28 },
    backText: { color: Colors.textMuted, fontSize: 15 },
    icon: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    subtitle: { fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginBottom: 28 },
    fieldGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    input: {
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
        padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.offWhite,
    },
    inputError: { borderColor: Colors.danger },
    errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
    btn: {
        backgroundColor: Colors.primary, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center',
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 36 },
    successIcon: { fontSize: 60, marginBottom: 20 },
    successTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 12 },
    successText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
});
