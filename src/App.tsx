import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes: Begin */}
              <Route path="/"            element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              {/* Protected routes: End */}

              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
