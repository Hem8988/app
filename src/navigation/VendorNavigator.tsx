import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../theme/colors';

import VendorDashboardScreen from '../screens/vendor/DashboardScreen';
import VendorScreensScreen from '../screens/vendor/ScreensScreen';
import VendorCampaignsScreen from '../screens/vendor/CampaignsScreen';
import VendorEarningsScreen from '../screens/vendor/EarningsScreen';
import VendorProfileScreen from '../screens/vendor/ProfileScreen';
import CreateScreenScreen from '../screens/vendor/CreateScreenScreen';
import VendorScreenDetailScreen from '../screens/vendor/ScreenDetailScreen';
import VendorCampaignDetailScreen from '../screens/vendor/CampaignDetailScreen';
import VendorWithdrawalsScreen from '../screens/vendor/WithdrawalsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        Dashboard: '🏠',
        Screens: '📺',
        Campaigns: '📢',
        Earnings: '💰',
        Profile: '👤',
    };
    return (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {icons[name] || '•'}
        </Text>
    );
}

function VendorTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon name={route.name} focused={focused} />
                ),
                tabBarActiveTintColor: Colors.vendorAccent,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.border,
                    height: 62,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            })}>
            <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
            <Tab.Screen name="Screens" component={VendorScreensScreen} />
            <Tab.Screen name="Campaigns" component={VendorCampaignsScreen} />
            <Tab.Screen name="Earnings" component={VendorEarningsScreen} />
            <Tab.Screen name="Profile" component={VendorProfileScreen} />
        </Tab.Navigator>
    );
}

export default function VendorNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="VendorTabs" component={VendorTabs} />
            <Stack.Screen name="CreateScreen" component={CreateScreenScreen} />
            <Stack.Screen name="ScreenDetail" component={VendorScreenDetailScreen} />
            <Stack.Screen name="CampaignDetail" component={VendorCampaignDetailScreen} />
            <Stack.Screen name="Withdrawals" component={VendorWithdrawalsScreen} />
        </Stack.Navigator>
    );
}
