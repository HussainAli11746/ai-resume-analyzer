import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/auth",
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
