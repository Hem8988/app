import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
    StatusBar, ActivityIndicator, Image, RefreshControl,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { customerApi } from '../../api/customer';

const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];

export default function BrowseScreensScreen({ navigation }: any) {
    const [screens, setScreens] = useState<any[]>([]);
    const [filteredScreens, setFilteredScreens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');

    const loadScreens = async () => {
        try {
            const params = selectedCity !== 'All' ? { city: selectedCity } : {};
            const res = await customerApi.browseScreens(params);
            const list = res.data?.screens || res.data || [];
            setScreens(list);
            applyFilter(list, search, selectedCity);
        } catch {
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadScreens(); }, [selectedCity]);

    const applyFilter = (list: any[], q: string, city: string) => {
        let result = list;
        if (q) result = result.filter(s => s.name?.toLowerCase().includes(q.toLowerCase()) || s.city?.toLowerCase().includes(q.toLowerCase()));
        setFilteredScreens(result);
    };

    const handleSearch = (q: string) => {
        setSearch(q);
        applyFilter(screens, q, selectedCity);
    };

    const renderScreen = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ScreenDetail', { screenId: item.id })}>
            <View style={styles.cardImage}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.imagePlaceholderIcon}>📺</Text>
                    </View>
                )}
                {item.is_featured && (
                    <View style={styles.featuredBadge}><Text style={styles.featuredText}>⭐ Featured</Text></View>
                )}
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.screenName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.screenLocation}>📍 {item.city}{item.locality ? `, ${item.locality}` : ''}</Text>
                <View style={styles.cardRow}>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>₹{item.price_per_day}/day</Text>
                    </View>
                    {item.screen_type && (
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{item.screen_type}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Browse Screens</Text>
                <Text style={styles.headerCount}>{filteredScreens.length} available</Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrapper}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or city..."
                    placeholderTextColor={Colors.textMuted}
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>

            {/* City Filter */}
            <View>
                <FlatList
                    data={CITIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cityList}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.cityChip, selectedCity === item && styles.cityChipActive]}
                            onPress={() => setSelectedCity(item)}>
                            <Text style={[styles.cityChipText, selectedCity === item && styles.cityChipTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    data={filteredScreens}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderScreen}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadScreens(); }} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📺</Text>
                            <Text style={styles.emptyTitle}>No screens found</Text>
                            <Text style={styles.emptyText}>Try adjusting your filters</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.offWhite },
    header: {
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12,
        backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
    headerCount: { fontSize: 13, color: Colors.textMuted },
    searchWrapper: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: Colors.white, margin: 12, borderRadius: 12,
        paddingHorizontal: 14, borderWidth: 1.5, borderColor: Colors.border,
    },
    searchIcon: { fontSize: 16 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.text },
    cityList: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
    cityChip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
    },
    cityChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    cityChipText: { color: Colors.textMuted, fontWeight: '600', fontSize: 13 },
    cityChipTextActive: { color: '#fff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 12, paddingTop: 0 },
    row: { gap: 12, marginBottom: 12 },
    card: {
        flex: 1, backgroundColor: Colors.white, borderRadius: 16,
        overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    cardImage: { position: 'relative' },
    image: { width: '100%', height: 120 },
    imagePlaceholder: { backgroundColor: Colors.offWhite, justifyContent: 'center', alignItems: 'center' },
    imagePlaceholderIcon: { fontSize: 36 },
    featuredBadge: {
        position: 'absolute', top: 8, left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
    },
    featuredText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    cardBody: { padding: 10 },
    screenName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 4 },
    screenLocation: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
    cardRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    priceBadge: { backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    priceText: { color: Colors.primary, fontSize: 11, fontWeight: '700' },
    typeBadge: { backgroundColor: Colors.offWhite, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    typeText: { color: Colors.textMuted, fontSize: 10 },
    emptyState: { alignItems: 'center', paddingTop: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    emptyText: { fontSize: 13, color: Colors.textMuted },
});
