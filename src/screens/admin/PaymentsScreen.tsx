import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminPaymentsScreen() {
    return (
        <View style={styles.container}>
            <Text>Admin Payments</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
