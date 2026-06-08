import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: `${BASE_URL}/auth`,
    withCredentials: true,
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Register Error:", error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (error) {
        console.error("GetMe Error:", error);
        throw error;
    }
}
