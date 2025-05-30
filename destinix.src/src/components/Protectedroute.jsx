import { Navigate } from "react-router-dom";
import { useAuth } from "../Authcontext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    // Si no hay sesión, redirige al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay roles permitidos definidos, y el rol del usuario no está en la lista, redirige
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
