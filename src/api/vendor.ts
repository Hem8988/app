import client from './client';

export const vendorApi = {
    dashboard: () => client.get('/vendor/dashboard'),

    // Screens
    getScreens: () => client.get('/vendor/screens'),
    createScreen: (formData: FormData) =>
        client.post('/vendor/screens', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getScreen: (id: number) => client.get(`/vendor/screen/${id}`),
    updateScreen: (id: number, formData: FormData) =>
        client.post(`/vendor/screen/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    deleteScreen: (id: number) => client.delete(`/vendor/screen/${id}`),
    toggleScreen: (id: number) => client.post(`/vendor/screen/${id}/toggle`),

    // Campaigns
    getCampaigns: () => client.get('/vendor/campaigns'),
    getCampaign: (id: number) => client.get(`/vendor/campaign/${id}`),
    approveCampaign: (id: number) => client.put(`/vendor/campaign/${id}/approve`),
    rejectCampaign: (id: number, reason: string) =>
        client.put(`/vendor/campaign/${id}/reject`, { reason }),
    uploadReport: (id: number, formData: FormData) =>
        client.post(`/vendor/campaign/${id}/upload-report`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    // Earnings & Withdrawals
    getEarnings: () => client.get('/vendor/earnings'),
    getWithdrawals: () => client.get('/vendor/withdrawals'),
    requestWithdrawal: (amount: number) =>
        client.post('/vendor/withdrawal/request', { amount }),

    // Reports
    getReports: (params?: any) => client.get('/vendor/reports', { params }),

    // Proof of Play
    getProofOfPlays: () => client.get('/vendor/proof-of-play'),

    // Calendar
    getCalendar: () => client.get('/vendor/calendar'),

    // Profile
    getProfile: () => client.get('/vendor/profile'),
    updateProfile: (data: any) => client.put('/vendor/profile', data),
};
