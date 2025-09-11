import { Routes, Route } from "react-router";
import Homepage from "../Pages/Homepage";
import Your_Channel_Page from "../Pages/Your_Channel_Page"
import Your_Video_Page from "../Pages/Your_Video_Page";
import Playlistpage from "../Pages/Playlistpage";
import Liked_Video_Page from "../Pages/Liked_Video_Page";
import Liked_Tweet_Page from "../Pages/Liked_Tweet_Page";
import Watch_History_Page from "../Pages/Watch_History_Page";
import Watch_Video_Page from "../Pages/Watch_Video_page";
import Subscription_Page from "../Pages/Subscription_Page";
import Upload_Video_Page from "../Pages/Upload_Video_Page";
import Upload_Tweet_Page from "../Pages/Upload_Tweet_Page";
import Full_Playlist_Page from "../Pages/Full_Playlist_Page";
import Loginpage from "../Pages/Loginpage";
import RegisterPage from "../Pages/Registerpage";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import Edit_Account_Page from "../Pages/Edit_Account_Page";
import Manage_Video_Page from "../Pages/Manage_Video_Page";


export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Loginpage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/profile" element={<Your_Channel_Page/> }/>
        <Route path="/your-videos" element={<Your_Video_Page/>}/>
        <Route path="/your-channel" element={<Your_Channel_Page/>} />
        <Route path="/your-playlist" element={<Playlistpage/>} />
        <Route path="/full-playlist" element={<Full_Playlist_Page/>} />
        <Route path="/liked-videos" element={<Liked_Video_Page/>} />
        <Route path="/liked-tweets" element={<Liked_Tweet_Page/>} />
        <Route path="/watch-history" element={<Watch_History_Page/>} />
        <Route path="/watch-video/:id" element={<Watch_Video_Page />} />
        <Route path="/subscriptions" element={<Subscription_Page/>} />
        <Route path="/subscriptions" element={<Subscription_Page/>} />
        <Route path="/upload-video" element={<Upload_Video_Page/>} />
        <Route path="/upload-tweet" element={<Upload_Tweet_Page/>} />
        <Route path="/edit-account" element={<Edit_Account_Page/>} />
        <Route path="/manage-videos" element={<Manage_Video_Page/>} />
        </Route>
      </Routes>
    </div>
  )
}
