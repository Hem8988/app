import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../theme/colors';

// Screens
import CustomerDashboardScreen from '../screens/customer/DashboardScreen';
import BrowseScreensScreen from '../screens/customer/BrowseScreensScreen';
import CampaignsScreen from '../screens/customer/CampaignsScreen';
import WalletScreen from '../screens/customer/WalletScreen';
import CustomerProfileScreen from '../screens/customer/ProfileScreen';
import ScreenDetailScreen from '../screens/customer/ScreenDetailScreen';
import CreateCampaignScreen from '../screens/customer/CreateCampaignScreen';
import CampaignDetailScreen from '../screens/customer/CampaignDetailScreen';
import InvoicesScreen from '../screens/customer/InvoicesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        Dashboard: '🏠',
        Browse: '🔍',
        Campaigns: '📢',
        Wallet: '💳',
        Profile: '👤',
    };
    return (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {icons[name] || '•'}
        </Text>
    );
}

function CustomerTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon name={route.name} focused={focused} />
                ),
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.border,
                    height: 62,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            })}>
            <Tab.Screen name="Dashboard" component={CustomerDashboardScreen} />
            <Tab.Screen name="Browse" component={BrowseScreensScreen} />
            <Tab.Screen name="Campaigns" component={CampaignsScreen} />
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="Profile" component={CustomerProfileScreen} />
        </Tab.Navigator>
    );
}

export default function CustomerNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
            <Stack.Screen name="ScreenDetail" component={ScreenDetailScreen} />
            <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
            <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
            <Stack.Screen name="Invoices" component={InvoicesScreen} />
        </Stack.Navigator>
    );
}
