import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';

const ProtectedRoute = ({ roles = [], children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
 
  const checkAuth = () => {
    if (!token) {
      console.log('No Token')
      return false; 
    }
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      
      if (isExpired) {
        console.log('Expired')
        dispatch(logout());
        return false;
      }
       console.log('OK')
      return true;
    } catch (error) {
       console.log('error:', error)
      console.error('Token validation error:', error);
      dispatch(logout());
      return false;
    }
  };
 
  if (!checkAuth()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  } 
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
