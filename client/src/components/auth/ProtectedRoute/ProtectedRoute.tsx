import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // sửa lại path đúng chỗ bạn đặt AuthContext
import type { AuthUser } from "../..//../api/auth"; // sửa lại path đúng chỗ định nghĩa AuthUser

type Props = {
  allowedRoles?: AuthUser["role"][];
};

function ProtectedRoute({ allowedRoles }: Props) {
  const { currentUser, currentUserRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/landing" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;