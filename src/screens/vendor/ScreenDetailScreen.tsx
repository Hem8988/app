import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VendorScreenDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Vendor Screen Detail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
