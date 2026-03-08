import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen({ navigation }: any) {
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const validate = () => {
        const e: any = {};
        if (!email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
        if (!password) e.password = 'Password is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        try {
            await login(email.trim().toLowerCase(), password);
            // Navigation handled by RootNavigator watching auth state
        } catch (err: any) {
            Alert.alert('Login Failed', err.message || 'Please check your credentials.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Back */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.logoRow}>
                    <View style={styles.logoIcon}><Text style={styles.logoLetter}>A</Text></View>
                    <Text style={styles.logoLabel}>AYMRK <Text style={{ color: Colors.primary }}>Manager</Text></Text>
                </View>

                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in to manage your campaigns and screens</Text>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="you@example.com"
                            placeholderTextColor={Colors.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={t => { setEmail(t); setErrors((e: any) => ({ ...e, email: null })); }}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, styles.inputPassword, errors.password && styles.inputError]}
                                placeholder="Enter your password"
                                placeholderTextColor={Colors.textMuted}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={t => { setPassword(t); setErrors((e: any) => ({ ...e, password: null })); }}
                            />
                            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <TouchableOpacity
                        style={styles.forgotLink}
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginBtn, isLoading && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Register links */}
                <View style={styles.registerOptions}>
                    <Text style={styles.registerLabel}>Don't have an account?</Text>
                    <TouchableOpacity
                        style={styles.registerBtn}
                        onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerBtnText}>Create Advertiser Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.registerBtn, styles.registerBtnOutline]}
                        onPress={() => navigation.navigate('RegisterVendor')}>
                        <Text style={[styles.registerBtnText, { color: Colors.vendorAccent }]}>
                            List My Screen (Vendor)
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scroll: { paddingHorizontal: 24, paddingBottom: 40 },
    backBtn: { paddingTop: 52, marginBottom: 28 },
    backText: { color: Colors.textMuted, fontSize: 15 },
    logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    logoIcon: {
        width: 36, height: 36, borderRadius: 9,
        backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    logoLetter: { color: '#fff', fontSize: 18, fontWeight: '900' },
    logoLabel: { fontSize: 18, fontWeight: '800', color: Colors.text },
    title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    subtitle: { fontSize: 15, color: Colors.textMuted, marginBottom: 32, lineHeight: 22 },
    form: { gap: 16 },
    fieldGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.text },
    input: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.text,
        backgroundColor: Colors.offWhite,
    },
    inputError: { borderColor: Colors.danger },
    inputPassword: { paddingRight: 50 },
    passwordWrapper: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: 14, top: 14 },
    eyeIcon: { fontSize: 18 },
    errorText: { color: Colors.danger, fontSize: 12, marginTop: 2 },
    forgotLink: { alignSelf: 'flex-end' },
    forgotText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
    loginBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    btnDisabled: { opacity: 0.6 },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { color: Colors.textMuted, fontSize: 13 },
    registerOptions: { gap: 12 },
    registerLabel: { color: Colors.textMuted, textAlign: 'center', fontSize: 14 },
    registerBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    registerBtnOutline: {
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderColor: Colors.vendorAccent,
    },
    registerBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
