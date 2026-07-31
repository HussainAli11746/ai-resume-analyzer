import { useContext } from "react";
import { AuthContext } from "../auth/auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async (email, password) => {
        setLoading("login");
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const handleRegister = async (username, email, password) => {
        setLoading("register");
        try {
            const data = await register({ username, email, password });
            // Use user from register response, or fallback to getMe() if not included
            if (data.user) {
                setUser(data.user);
            } else {
                const me = await getMe();
                setUser(me?.user || me);
            }
            return data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading("logout");
        try {
            const data = await logout();
            setUser(null);
            return data;
        }
        catch (error) {
            console.log(error);
            setUser(null);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    return {
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};
