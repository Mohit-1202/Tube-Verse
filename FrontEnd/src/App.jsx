import './App.css'
import Login from './Components/Login/Login'
import AddVideo from './Components/Videos/AddVideo'
import GetVideo from './Components/Videos/GetVideo';
import VideoState from './Context/Videos/VideoState'
import { BrowserRouter, Routes, Route } from "react-router";

function App() {

  return (
    <>
    <VideoState>
      <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/addvideo" element={<AddVideo/>}/>
      <Route exact path="/allvideos" element={<GetVideo/>} />
      </Routes>
      </BrowserRouter>
      </VideoState>
    </>
  )
}

export default App
