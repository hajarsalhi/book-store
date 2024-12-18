import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Clear everything at startup
    localStorage.clear();
    dispatch(setUser(null));
    
    setIsInitialized(true);

    // Cleanup function
    return () => {
      localStorage.clear();
      dispatch(setUser(null));
    };
  }, [dispatch]);

  // Don't render children until initialization is complete
  if (!isInitialized) {
    return null;
  }

  return children;
}

export default AppInitializer; 