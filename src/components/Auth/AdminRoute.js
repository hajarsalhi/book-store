import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute; 