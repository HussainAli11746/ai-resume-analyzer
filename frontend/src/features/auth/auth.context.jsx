import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await getMe();
                setUser(data?.user || data);
            } catch (error) {
                // When unauthenticated, getMe throws 401, so we set user to null
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};