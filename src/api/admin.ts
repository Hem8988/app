import client from './client';

export const adminApi = {
    dashboard: () => client.get('/admin/dashboard'),

    // Customers
    getCustomers: () => client.get('/admin/customers'),
    getCustomer: (id: number) => client.get(`/admin/customer/${id}`),
    updateCustomerStatus: (id: number, status: string) =>
        client.put(`/admin/user/${id}/status`, { status }),

    // Vendors
    getVendors: () => client.get('/admin/vendors'),
    getVendor: (id: number) => client.get(`/admin/vendor/${id}`),
    approveVendor: (id: number) => client.put(`/admin/vendor/${id}/approve`),
    suspendVendor: (id: number) => client.put(`/admin/vendor/${id}/suspend`),

    // Screens
    getScreens: (params?: any) => client.get('/admin/screens', { params }),
    getScreen: (id: number) => client.get(`/admin/screen/${id}`),
    updateScreenStatus: (id: number, status: string) =>
        client.put(`/admin/screen/${id}/status`, { status }),
    featureScreen: (id: number) => client.put(`/admin/screen/${id}/feature`),

    // Campaigns
    getCampaigns: (params?: any) => client.get('/admin/campaigns', { params }),
    getCampaign: (id: number) => client.get(`/admin/campaign/${id}`),
    approveCampaign: (id: number) => client.put(`/admin/campaign/${id}/approve`),
    rejectCampaign: (id: number, reason: string) =>
        client.put(`/admin/campaign/${id}/reject`, { reason }),
    stopCampaign: (id: number) => client.put(`/admin/campaign/${id}/stop`),

    // Withdrawals
    getWithdrawals: () => client.get('/admin/withdrawals'),
    approveWithdrawal: (id: number) => client.put(`/admin/withdrawal/${id}/approve`),
    rejectWithdrawal: (id: number, reason: string) =>
        client.put(`/admin/withdrawal/${id}/reject`, { reason }),

    // Payments
    getPayments: () => client.get('/admin/payments'),

    // Coupons
    getCoupons: () => client.get('/admin/coupons'),
    createCoupon: (data: any) => client.post('/admin/coupon/store', data),
    toggleCoupon: (id: number) => client.put(`/admin/coupon/${id}/toggle`),
    deleteCoupon: (id: number) => client.delete(`/admin/coupon/${id}`),

    // Gallery
    getGallery: () => client.get('/gallery'),
    deleteGallery: (id: number) => client.delete(`/admin/gallery/${id}`),

    // Settings
    getSettings: () => client.get('/admin/settings'),
    updateSettings: (data: any) => client.put('/admin/settings', data),

    // Reports
    getReports: (params?: any) => client.get('/admin/reports', { params }),
    getRevenueReport: () => client.get('/admin/reports/revenue'),
};
