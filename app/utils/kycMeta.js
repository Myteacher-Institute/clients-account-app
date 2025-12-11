import { colors } from '@/theme';

export const kycMeta = (kyc) => {
    let state;

    switch (kyc?.verificationStatus) {
        case 'verified':
            state = 'verified';
            break;
        case 'pending':
            state = 'pending';
            break;
        case 'unverified':
        default:
            state = 'unverified';
            break;
    }

    const meta = {
        unverified: { color: colors.red4, icon: 'alert-remove' },
        pending: { color: colors.yellow3, icon: 'alert-decagram' },
        verified: { color: colors.green4, icon: 'check-decagram' },
    };

    return { state, ...meta[state] };
};
