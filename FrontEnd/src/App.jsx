import './App.css';
import VideoState from './Context/Videos/VideoState.jsx';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from './Routes/AppRoutes';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import UserState from './Context/User/UserState.jsx';

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
    <UserState>
      <VideoState>
        <BrowserRouter>
          <LayoutWithNavbar />
        </BrowserRouter>
      </VideoState>
    </UserState>
  );
}

export default App;
