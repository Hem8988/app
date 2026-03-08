import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { Colors } from '../theme/colors';

import AuthStack from './AuthStack';
import CustomerNavigator from './CustomerNavigator';
import VendorNavigator from './VendorNavigator';
import AdminNavigator from './AdminNavigator';

export default function RootNavigator() {
    const { user, isHydrated, hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    if (!isHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const renderNavigator = () => {
        if (!user) return <AuthStack />;
        if (user.role === 'customer') return <CustomerNavigator />;
        if (user.role === 'vendor') return <VendorNavigator />;
        if (user.role === 'admin' || user.role === 'super_admin') return <AdminNavigator />;
        return <AuthStack />;
    };

    return (
        <NavigationContainer>
            {renderNavigator()}
        </NavigationContainer>
    );
}
