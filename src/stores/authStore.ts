import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

export type UserRole = 'customer' | 'vendor' | 'admin' | 'super_admin';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isHydrated: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    registerVendor: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isHydrated: false,
    error: null,

    hydrate: async () => {
        try {
            const [token, userJson] = await Promise.all([
                AsyncStorage.getItem('auth_token'),
                AsyncStorage.getItem('auth_user'),
            ]);
            if (token && userJson) {
                set({ user: JSON.parse(userJson), token, isHydrated: true });
            } else {
                set({ isHydrated: true });
            }
        } catch {
            set({ isHydrated: true });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authApi.login(email, password);
            const { token, user } = data;
            await Promise.all([
                AsyncStorage.setItem('auth_token', token),
                AsyncStorage.setItem('auth_user', JSON.stringify(user)),
            ]);
            set({ user, token, isLoading: false });
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Login failed. Please try again.';
            set({ isLoading: false, error: msg });
            throw new Error(msg);
        }
    },

    register: async data => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await authApi.register(data);
            const { token, user } = res;
            await Promise.all([
                AsyncStorage.setItem('auth_token', token),
                AsyncStorage.setItem('auth_user', JSON.stringify(user)),
            ]);
            set({ user, token, isLoading: false });
        } catch (error: any) {
            const msg =
                error.response?.data?.message || 'Registration failed. Please try again.';
            set({ isLoading: false, error: msg });
            throw new Error(msg);
        }
    },

    registerVendor: async data => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await authApi.registerVendor(data);
            const { token, user } = res;
            await Promise.all([
                AsyncStorage.setItem('auth_token', token),
                AsyncStorage.setItem('auth_user', JSON.stringify(user)),
            ]);
            set({ user, token, isLoading: false });
        } catch (error: any) {
            const msg =
                error.response?.data?.message || 'Registration failed. Please try again.';
            set({ isLoading: false, error: msg });
            throw new Error(msg);
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // ignore logout errors
        }
        await Promise.all([
            AsyncStorage.removeItem('auth_token'),
            AsyncStorage.removeItem('auth_user'),
        ]);
        set({ user: null, token: null });
    },

    clearError: () => set({ error: null }),
}));
