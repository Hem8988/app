import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminCustomerDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Admin Customer Detail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
