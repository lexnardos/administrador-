import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, checkSession } from "./services/api"; // Asegúrate de que checkSession esté exportado

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const data = await checkSession();
                if (data.loggedIn) {
                    setUser({
                        id: data.id_persona,
                        rol: data.rol_idRol
                    });
                }
                else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error al verificar sesión:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await loginUser(email, password);
            if (result.success) {
                setUser({
                    id: result.id_persona,
                    rol: result.rol_idRol
                });
            }

            return result;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);