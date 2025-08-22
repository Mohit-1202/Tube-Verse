import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
// import LoaderContext from "../../Context/Loader/LoaderContext";


const ProtectedRoute = () => {
  const { user, userDetails } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        const success = await userDetails();
        setIsAuthenticated(success);
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkUser();
  }, [user, userDetails]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
