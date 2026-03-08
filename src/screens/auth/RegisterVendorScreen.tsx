import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterVendorScreen({ navigation }: any) {
    const { registerVendor, isLoading } = useAuthStore();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', business_name: '', city: '',
        password: '', password_confirmation: '',
    });
    const [errors, setErrors] = useState<any>({});

    const update = (key: string, val: string) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors((e: any) => ({ ...e, [key]: null }));
    };

    const validate = () => {
        const e: any = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.phone.trim()) e.phone = 'Phone is required';
        if (!form.business_name.trim()) e.business_name = 'Business name is required';
        if (!form.city.trim()) e.city = 'City is required';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 8) e.password = 'Minimum 8 characters';
        if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        try {
            await registerVendor({ ...form, email: form.email.trim().toLowerCase() });
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message);
        }
    };

    const Field = ({ label, field, placeholder, keyboardType = 'default', secure = false }: any) => (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, errors[field] && styles.inputError]}
                placeholder={placeholder}
                placeholderTextColor={Colors.textMuted}
                keyboardType={keyboardType}
                autoCapitalize={field === 'email' ? 'none' : 'words'}
                secureTextEntry={secure}
                value={form[field as keyof typeof form]}
                onChangeText={t => update(field, t)}
            />
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
                    <Text style={styles.roleTagText}>📺 Screen Owner (Vendor) Account</Text>
                </View>

                <Text style={styles.title}>List Your Screen</Text>
                <Text style={styles.subtitle}>
                    Earn passive income by monetizing your Android TV or Digital Display across India
                </Text>

                {/* Highlights */}
                <View style={styles.highlights}>
                    {['Passive income daily', 'No sales effort required', 'Real-time earnings dashboard'].map(h => (
                        <View key={h} style={styles.highlightRow}>
                            <Text style={styles.checkMark}>✅</Text>
                            <Text style={styles.highlightText}>{h}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.form}>
                    <Field label="Full Name" field="name" placeholder="Your name" />
                    <Field label="Email Address" field="email" placeholder="you@example.com" keyboardType="email-address" />
                    <Field label="Phone Number" field="phone" placeholder="+91 98765 43210" keyboardType="phone-pad" />
                    <Field label="Business / Shop Name" field="business_name" placeholder="e.g. ABC Electronics" />
                    <Field label="City" field="city" placeholder="e.g. Mumbai, Delhi, Bangalore" />
                    <Field label="Password" field="password" placeholder="Min. 8 characters" secure />
                    <Field label="Confirm Password" field="password_confirmation" placeholder="Repeat password" secure />

                    <TouchableOpacity
                        style={[styles.btn, isLoading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register as Screen Owner</Text>}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.switchLink} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.switchText}>
                        Already have an account? <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign In</Text>
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
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)',
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16,
    },
    roleTagText: { color: Colors.vendorAccent, fontWeight: '600', fontSize: 13 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    subtitle: { fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginBottom: 20 },
    highlights: {
        backgroundColor: 'rgba(34, 197, 94, 0.06)',
        borderRadius: 12, borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        padding: 16, marginBottom: 24, gap: 10,
    },
    highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    checkMark: { fontSize: 16 },
    highlightText: { color: Colors.text, fontWeight: '600', fontSize: 14 },
    form: { gap: 16 },
    fieldGroup: {},
    label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    input: {
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
        padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.offWhite,
    },
    inputError: { borderColor: Colors.danger },
    error: { color: Colors.danger, fontSize: 12, marginTop: 4 },
    btn: {
        backgroundColor: Colors.vendorAccent, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    switchLink: { paddingTop: 24, alignItems: 'center' },
    switchText: { color: Colors.textMuted, fontSize: 14 },
});
