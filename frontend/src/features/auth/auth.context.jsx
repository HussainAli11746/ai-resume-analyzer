import { createContext, useState, useEffect, useRef } from "react";
import { getMe } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userExplicitlySet = useRef(false);

    // Wrap setUser so we can track if it was explicitly set by login/register
    const setUserWithFlag = (userOrUpdater) => {
        userExplicitlySet.current = true;
        setUser(userOrUpdater);
    };

    useEffect(() => {
        const getUser = async () => {
            // Skip fetching if user was already set by login/register
            if (userExplicitlySet.current) {
                setLoading(false);
                return;
            }
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
        <AuthContext.Provider value={{ user, setUser: setUserWithFlag, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};