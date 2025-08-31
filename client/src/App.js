import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import SkillList from "./pages/SkillList";
import AddSkill from "./pages/AddSkill";
import EditSkill from "./pages/EditSkill";

import Login from "./pages/Login";
import Register from "./pages/Register";

import BookSession from "./pages/BookSession";
import Sessions from "./pages/Sessions";

import Offers from "./pages/Offers";
import NewOffer from "./pages/NewOffer";
import OfferChat from "./pages/OfferChat";

import Points from "./pages/Points";
import NotFound from "./pages/NotFound";

import RatingPage from "./pages/RatingPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

import "./styles.css";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const handleLogin = (user, id) => {
    setUsername(user);
    setUserId(id);
    localStorage.setItem("username", user);
    localStorage.setItem("userId", id);
  };

  const handleLogout = () => {
    setUsername("");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  return (
    <BrowserRouter>
      <header>
        <h1>SwappySkill</h1>
        {username ? (
          <>
            <span>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
        <nav>
          <Link to="/">Home</Link>{" "}
          <Link to="/add">Add Skill</Link>{" "}
          <Link to="/sessions">Sessions</Link>{" "}
          <Link to="/offers">Offers</Link>{" "}
          <Link to="/points">Points</Link>{" "}
          <Link to="/notifications">Notifications</Link>{" "}
          <Link to="/profile">Profile</Link>{" "}
          <Link to="/search">Search</Link>
        </nav>
      </header>

      <Routes>
        {/* Core Features */}
        <Route path="/" element={<SkillList />} />
        <Route path="/add" element={<AddSkill />} />
        <Route path="/edit/:id" element={<EditSkill />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Sessions */}
        <Route path="/book/:skillId" element={<BookSession />} />
        <Route path="/sessions" element={<Sessions />} />

        {/* Offers */}
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/new" element={<NewOffer />} />
        <Route path="/offers/:id" element={<OfferChat />} />

        {/* Points */}
        <Route path="/points" element={<Points />} />

        {/* Rating */}
        <Route
          path="/rating/:targetUserId"
          element={<RatingPage currentUserId={userId} />}
        />

        {/* Other pages */}
        <Route path="/notifications" element={<NotificationsPage currentUserId={userId} />} />
        <Route path="/profile" element={<ProfilePage currentUserId={userId} />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
