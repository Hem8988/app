import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminSettingsScreen() {
    return (
        <View style={styles.container}>
            <Text>Admin Settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
