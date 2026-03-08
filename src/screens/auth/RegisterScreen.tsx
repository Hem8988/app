import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterScreen({ navigation }: any) {
    const { register, isLoading } = useAuthStore();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState<any>({});
    const [showPass, setShowPass] = useState(false);

    const update = (key: string, val: string) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors((e: any) => ({ ...e, [key]: null }));
    };

    const validate = () => {
        const e: any = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 8) e.password = 'Minimum 8 characters';
        if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        try {
            await register({ ...form, email: form.email.trim().toLowerCase() });
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message);
        }
    };

    const Field = ({ label, field, placeholder, keyboardType = 'default', secure = false, showToggle = false }: any) => (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, showToggle && styles.inputPad, errors[field] && styles.inputError]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    keyboardType={keyboardType}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                    secureTextEntry={secure && !showPass}
                    value={form[field as keyof typeof form]}
                    onChangeText={t => update(field, t)}
                />
                {showToggle && (
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                        <Text>{showPass ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.roleTag}>
                    <Text style={styles.roleTagText}>📢 Advertiser Account</Text>
                </View>

                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Start advertising across India's premium DOOH network</Text>

                <View style={styles.form}>
                    <Field label="Full Name" field="name" placeholder="Your full name" />
                    <Field label="Email Address" field="email" placeholder="you@example.com" keyboardType="email-address" />
                    <Field label="Phone Number" field="phone" placeholder="+91 98765 43210" keyboardType="phone-pad" />
                    <Field label="Password" field="password" placeholder="Min. 8 characters" secure showToggle />
                    <Field label="Confirm Password" field="password_confirmation" placeholder="Repeat your password" secure />

                    <TouchableOpacity
                        style={[styles.btn, isLoading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        By registering, you agree to our{' '}
                        <Text style={{ color: Colors.primary }}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={{ color: Colors.primary }}>Privacy Policy</Text>
                    </Text>
                </View>

                <TouchableOpacity style={styles.switchLink} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.switchText}>
                        Already have an account? <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign In</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.vendorLink} onPress={() => navigation.navigate('RegisterVendor')}>
                    <Text style={styles.vendorLinkText}>
                        Want to list your screen? <Text style={{ color: Colors.vendorAccent, fontWeight: '700' }}>Register as Vendor →</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scroll: { paddingHorizontal: 24, paddingBottom: 40 },
    backBtn: { paddingTop: 52, marginBottom: 24 },
    backText: { color: Colors.textMuted, fontSize: 15 },
    roleTag: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 16,
    },
    roleTagText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    subtitle: { fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginBottom: 28 },
    form: { gap: 16 },
    fieldGroup: {},
    label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    inputWrapper: { position: 'relative' },
    input: {
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
        padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.offWhite,
    },
    inputPad: { paddingRight: 50 },
    inputError: { borderColor: Colors.danger },
    eyeBtn: { position: 'absolute', right: 14, top: 14 },
    error: { color: Colors.danger, fontSize: 12, marginTop: 4 },
    btn: {
        backgroundColor: Colors.primary, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    disclaimer: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
    switchLink: { paddingTop: 24, alignItems: 'center' },
    switchText: { color: Colors.textMuted, fontSize: 14 },
    vendorLink: { paddingTop: 12, alignItems: 'center' },
    vendorLinkText: { color: Colors.textMuted, fontSize: 13 },
});
