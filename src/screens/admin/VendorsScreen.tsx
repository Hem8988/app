import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminVendorsScreen() {
    return (
        <View style={styles.container}>
            <Text>Admin Vendors</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
