import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VendorCampaignDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Vendor Campaign Detail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
