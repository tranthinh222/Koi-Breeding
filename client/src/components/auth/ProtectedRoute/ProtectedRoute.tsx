import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // sửa lại path đúng chỗ bạn đặt AuthContext
import type { AuthUser } from "../..//../api/auth"; // sửa lại path đúng chỗ định nghĩa AuthUser

type Props = {
	allowedRoles?: AuthUser["role"][];
};

function ProtectedRoute({ allowedRoles }: Props) {
	const { currentUser, currentUserRole, loading } = useAuth();

	if (loading) {
		return (
			<main
				className="auth-loading-screen"
				role="status"
				aria-live="polite"
			>
				<div className="auth-loading-card">
					<span className="auth-loading-fish" aria-hidden="true">
						🐟
					</span>
					<h1>Returning to your sanctuary</h1>
					<p>Checking your session...</p>
				</div>
			</main>
		);
	}

	if (!currentUser) {
		return <Navigate to="/landing" replace />;
	}

	if (
		allowedRoles &&
		!allowedRoles.some(
			(role) =>
				role?.toUpperCase() === currentUserRole?.toUpperCase(),
		)
	) {
		return <Navigate to="/home" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
