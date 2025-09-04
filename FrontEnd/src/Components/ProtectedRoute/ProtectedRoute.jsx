import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import VideoSkeleton from "../Skeletons/VideoSkeleton";

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 gap-4 p-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
