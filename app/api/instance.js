import axios from 'axios';
import { toast } from '@/utils/toast';
import { Platform } from 'react-native';
import { clearToken } from '@/auth/token';

// 🧭 Dynamically pick correct base URL per platform
const baseURL =
    Platform.OS === 'android'
        ? 'http://192.168.18.21:3000/api/v1'
        : 'http://localhost:3000/api/v1';

// 🧱 Create axios instance
const instance = axios.create({ baseURL, timeout: 10000 });

// 🟢 Request interceptor: logs + JSON header management
instance.interceptors.request.use(req => {
    console.log('[AXIOS REQUEST]', req.method?.toUpperCase(), req.url, req.data || '');

    // Automatically handle JSON headers unless it's FormData
    if (req.data && !(req.data instanceof FormData)) {
        req.headers['Content-Type'] = 'application/json';
        req.headers.Accept = 'application/json';
    }

    return req;
});

// 🟢 Response interceptor: logs + token invalidation handling
instance.interceptors.response.use(
    res => {
        console.log('[AXIOS RESPONSE]', res.status, res.config.url, res.data);
        return res;
    },
    async err => {
        const status = err.response?.status;
        const message = err.response?.data?.message;
        const url = err.config?.url;

        console.warn('[AXIOS ERROR]', { url, status, message });

        // 🔴 Handle invalid token (auto logout)
        if (status === 403 && message?.toLowerCase().includes('invalid token')) {
            console.log('[Auth] ❌ Token rejected by backend → clearing');
            await clearToken();
            toast.error('Session expired. Please sign in again.');
        }

        return Promise.reject(err);
    }
);

export default instance;
