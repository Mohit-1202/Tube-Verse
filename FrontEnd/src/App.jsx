import './App.css';
import VideoState from './Context/Videos/VideoState';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from './Routes/AppRoutes';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';

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
    <VideoState>
      <BrowserRouter>
        <LayoutWithNavbar />
      </BrowserRouter>
    </VideoState>
  );
}

export default App;
