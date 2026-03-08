// AYMRK Manager — Design Tokens
export const Colors = {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',

    success: '#22c55e',
    successDark: '#16a34a',

    warning: '#f59e0b',
    warningDark: '#d97706',

    danger: '#ef4444',
    dangerDark: '#dc2626',

    dark: '#111524',
    darkCard: 'rgba(255,255,255,0.05)',
    white: '#ffffff',
    offWhite: '#F4F5F7',

    text: '#111827',
    textMuted: '#64748B',
    textLight: '#9ca3af',

    border: 'rgba(0,0,0,0.08)',
    borderLight: 'rgba(255,255,255,0.1)',

    // Role colors
    customerAccent: '#3B82F6',
    vendorAccent: '#22c55e',
    adminAccent: '#f59e0b',

    // Status
    statusPending: '#f59e0b',
    statusApproved: '#22c55e',
    statusRejected: '#ef4444',
    statusActive: '#3B82F6',
    statusCompleted: '#8b5cf6',
};

export const paperTheme = {
    colors: {
        primary: Colors.primary,
        background: Colors.white,
        surface: Colors.white,
        text: Colors.text,
        error: Colors.danger,
    },
};
