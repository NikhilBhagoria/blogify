import { BrowserRouter,Route,Routes } from "react-router"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blog from "./pages/Blog"
import { Blogs } from "./pages/Blogs"
import Publish from "./pages/Publish"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import NotFound from "./pages/NotFound"
import UnderConstruction from "./pages/UnderConstruction"
import Profile from "./pages/Profile"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute> <Signin/> </PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup/> </PublicRoute>} />
          <Route path="/signin" element={<PublicRoute> <Signin/> </PublicRoute>} />
          <Route path="/blog/:id" element={ <ProtectedRoute> <Blog/> </ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute> <Blogs/> </ProtectedRoute>} />
          <Route path="/publish" element={<ProtectedRoute> <Publish/> </ProtectedRoute>} />
          {/* <Route path="/profile" element={<ProtectedRoute> <UnderConstruction pageName="Profile Page" /> </ProtectedRoute>} /> */}
          <Route path="/profile" element={<ProtectedRoute> <Profile/> </ProtectedRoute>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
