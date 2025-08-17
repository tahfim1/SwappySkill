import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import SkillList from './pages/SkillList';
import AddSkill from './pages/AddSkill';
import EditSkill from './pages/EditSkill';

import Login from './pages/Login';
import Register from './pages/Register';

import BookSession from './pages/BookSession';
import Sessions from './pages/Sessions';

import Offers from './pages/Offers';
import NewOffer from './pages/NewOffer';
import OfferChat from './pages/OfferChat';

import Points from './pages/Points';
import NotFound from './pages/NotFound';

import './styles.css';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleLogin = (user) => {
    setUsername(user);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
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
          <Link to="/points">Points</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<SkillList />} />
        <Route path="/add" element={<AddSkill />} />
        <Route path="/edit/:id" element={<EditSkill />} />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/book/:skillId" element={<BookSession />} />
        <Route path="/sessions" element={<Sessions />} />

        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/new" element={<NewOffer />} />
        <Route path="/offers/:id" element={<OfferChat />} />

        <Route path="/points" element={<Points />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
