import client from './client';

export const authApi = {
    login: (email: string, password: string) =>
        client.post('/login', { email, password }),

    register: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
    }) => client.post('/register', data),

    registerVendor: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
        business_name?: string;
        city?: string;
    }) => client.post('/register/vendor', data),

    forgotPassword: (email: string) =>
        client.post('/forgot-password', { email }),

    logout: () => client.post('/logout'),

    me: () => client.get('/me'),
};
