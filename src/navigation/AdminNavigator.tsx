import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../theme/colors';

import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import AdminCustomersScreen from '../screens/admin/CustomersScreen';
import AdminVendorsScreen from '../screens/admin/VendorsScreen';
import AdminScreensScreen from '../screens/admin/ScreensScreen';
import AdminCampaignsScreen from '../screens/admin/CampaignsScreen';
import AdminWithdrawalsScreen from '../screens/admin/WithdrawalsScreen';
import AdminPaymentsScreen from '../screens/admin/PaymentsScreen';
import AdminCouponsScreen from '../screens/admin/CouponsScreen';
import AdminSettingsScreen from '../screens/admin/SettingsScreen';
import AdminCampaignDetailScreen from '../screens/admin/CampaignDetailScreen';
import AdminVendorDetailScreen from '../screens/admin/VendorDetailScreen';
import AdminCustomerDetailScreen from '../screens/admin/CustomerDetailScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const drawerItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Customers', icon: '👥' },
    { name: 'Vendors', icon: '🏪' },
    { name: 'Screens', icon: '📺' },
    { name: 'Campaigns', icon: '📢' },
    { name: 'Withdrawals', icon: '💸' },
    { name: 'Payments', icon: '💳' },
    { name: 'Coupons', icon: '🎟️' },
    { name: 'Settings', icon: '⚙️' },
];

function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
                <View style={styles.drawerLogo}>
                    <Text style={styles.drawerLogoText}>A</Text>
                </View>
                <Text style={styles.drawerBrand}>AYMRK Manager</Text>
                <Text style={styles.drawerRole}>Admin Panel</Text>
            </View>

            <View style={styles.drawerNav}>
                {drawerItems.map(item => {
                    const focused =
                        props.state.routes[props.state.index].name === item.name;
                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => props.navigation.navigate(item.name)}
                            style={[styles.drawerItem, focused && styles.drawerItemActive]}>
                            <Text style={styles.drawerItemIcon}>{item.icon}</Text>
                            <Text
                                style={[
                                    styles.drawerItemLabel,
                                    focused && styles.drawerItemLabelActive,
                                ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </DrawerContentScrollView>
    );
}

function AdminDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: { width: 260, backgroundColor: Colors.dark },
            }}>
            <Drawer.Screen name="Dashboard" component={AdminDashboardScreen} />
            <Drawer.Screen name="Customers" component={AdminCustomersScreen} />
            <Drawer.Screen name="Vendors" component={AdminVendorsScreen} />
            <Drawer.Screen name="Screens" component={AdminScreensScreen} />
            <Drawer.Screen name="Campaigns" component={AdminCampaignsScreen} />
            <Drawer.Screen name="Withdrawals" component={AdminWithdrawalsScreen} />
            <Drawer.Screen name="Payments" component={AdminPaymentsScreen} />
            <Drawer.Screen name="Coupons" component={AdminCouponsScreen} />
            <Drawer.Screen name="Settings" component={AdminSettingsScreen} />
        </Drawer.Navigator>
    );
}

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
            <Stack.Screen name="CampaignDetail" component={AdminCampaignDetailScreen} />
            <Stack.Screen name="VendorDetail" component={AdminVendorDetailScreen} />
            <Stack.Screen name="CustomerDetail" component={AdminCustomerDetailScreen} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerContainer: { backgroundColor: Colors.dark },
    drawerHeader: {
        padding: 24,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        marginBottom: 12,
    },
    drawerLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    drawerLogoText: { color: '#fff', fontSize: 24, fontWeight: '900' },
    drawerBrand: { color: '#fff', fontSize: 18, fontWeight: '800' },
    drawerRole: {
        color: Colors.textLight,
        fontSize: 12,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    drawerNav: { paddingHorizontal: 12 },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginVertical: 2,
    },
    drawerItemActive: { backgroundColor: Colors.primary },
    drawerItemIcon: { fontSize: 18, marginRight: 12 },
    drawerItemLabel: { color: Colors.textLight, fontSize: 15, fontWeight: '600' },
    drawerItemLabelActive: { color: '#fff' },
});
