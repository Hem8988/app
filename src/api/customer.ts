import client from './client';

export const customerApi = {
    dashboard: () => client.get('/customer/dashboard'),

    // Screens
    browseScreens: (params?: { city?: string; category?: string; min_price?: number; max_price?: number }) =>
        client.get('/customer/screens', { params }),

    screenDetail: (id: number) => client.get(`/customer/screen/${id}`),

    // Campaigns
    createCampaign: (data: any) => client.post('/customer/campaigns', data),
    getCampaigns: () => client.get('/customer/campaigns'),
    getCampaign: (id: number) => client.get(`/customer/campaign/${id}`),
    updateCampaign: (id: number, data: any) => client.put(`/customer/campaign/${id}`, data),
    deleteCampaign: (id: number) => client.delete(`/customer/campaign/${id}`),

    // Campaign Wizard Steps
    saveCampaignStep1: (data: any) => client.post('/customer/campaign/step1', data),
    addScreen: (campaignId: number, screenId: number) =>
        client.post(`/customer/campaign/${campaignId}/add-screen`, { screen_id: screenId }),
    removeScreen: (campaignId: number, screenId: number) =>
        client.post(`/customer/campaign/${campaignId}/remove-screen`, { screen_id: screenId }),
    uploadMedia: (campaignId: number, formData: FormData) =>
        client.post(`/customer/campaign/${campaignId}/save-media`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    setBudget: (campaignId: number, data: any) =>
        client.post(`/customer/campaign/${campaignId}/set-budget`, data),
    applyCoupon: (campaignId: number, code: string) =>
        client.post(`/customer/campaign/${campaignId}/apply-coupon`, { code }),
    removeCoupon: (campaignId: number) =>
        client.delete(`/customer/campaign/${campaignId}/remove-coupon`),
    createPaymentOrder: (campaignId: number) =>
        client.post(`/customer/campaign/${campaignId}/create-order`),
    verifyPayment: (campaignId: number, data: any) =>
        client.post(`/customer/campaign/${campaignId}/verify-payment`, data),
    payWithWallet: (campaignId: number) =>
        client.post(`/customer/campaign/${campaignId}/pay-wallet`),

    // Wallet
    getWallet: () => client.get('/customer/wallet'),
    createWalletOrder: (amount: number) =>
        client.post('/customer/wallet/create-order', { amount }),
    verifyWalletPayment: (data: any) =>
        client.post('/customer/wallet/verify-payment', data),

    // Invoices
    getInvoices: () => client.get('/customer/invoices'),

    // Profile
    getProfile: () => client.get('/customer/profile'),
    updateProfile: (data: any) => client.put('/customer/profile', data),

    // Notifications
    getNotifications: () => client.get('/notifications'),
    markNotificationRead: (id: string) => client.post(`/notifications/${id}/read`),
    markAllRead: () => client.post('/notifications/mark-all-read'),
    getUnreadCount: () => client.get('/notifications/unread-count'),
};
