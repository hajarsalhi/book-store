import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and save the attempted URL
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
