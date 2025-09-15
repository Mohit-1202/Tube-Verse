import './App.css';
import VideoState from './Context/Videos/VideoState.jsx';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from './Routes/AppRoutes';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import UserState from './Context/User/UserState.jsx';
import LoaderState from './Context/Loader/LoaderState.jsx';
import LikeState from './Context/Like/LikeState.jsx';
import CommentState from './Context/Comment/CommentState.jsx';

const LayoutWithNavbar = () => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const hideNavbarOn = ['/login', '/register'];
    setShowNavbar(!hideNavbarOn.includes(location.pathname));
  }, [location]);

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <LoaderState>
    <UserState>
      <VideoState>
        <CommentState>
        <LikeState>
        <BrowserRouter>
          <LayoutWithNavbar />
        </BrowserRouter>
        </LikeState>
        </CommentState>
      </VideoState>
    </UserState>
    </LoaderState>
  );
}

export default App;
