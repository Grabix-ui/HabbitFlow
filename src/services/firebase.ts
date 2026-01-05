
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const storedConfigKey = 'habitflow_firebase_config';

export const getStoredConfig = () => {
    const stored = localStorage.getItem(storedConfigKey);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

// Initialize Firebase dynamically
const initFirebase = () => {
    const config = getStoredConfig();
    
    // Default placeholder if nothing is stored
    const placeholder = {
        apiKey: "API_KEY_TU_WKLEJ",
        projectId: "placeholder"
    };

    const finalConfig = config || placeholder;

    // If already initialized, return existing app
    if (getApps().length > 0) {
        return getApp();
    }

    return initializeApp(finalConfig);
};

export const app = initFirebase();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isConfigured = () => {
    const config = getStoredConfig();
    return !!(config && config.apiKey && config.apiKey !== "API_KEY_TU_WKLEJ");
};

export const saveConfig = (config: object) => {
    localStorage.setItem(storedConfigKey, JSON.stringify(config));
    // Instead of reload, we let the App component handle the state change
};

export const resetConfig = () => {
    localStorage.removeItem(storedConfigKey);
    window.location.reload();
};
