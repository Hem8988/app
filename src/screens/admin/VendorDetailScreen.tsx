import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminVendorDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Admin Vendor Detail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
