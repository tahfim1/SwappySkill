import './styles.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SkillList from './pages/SkillList';
import AddSkill from './pages/AddSkill';
import EditSkill from './pages/EditSkill';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function AppWrapper() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUsername(user);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login'); // redirect to login
  };

  return (
    <>
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
          <Link to="/add">Add Skill</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<SkillList />} />
        <Route path="/add" element={<AddSkill />} />
        <Route path="/edit/:id" element={<EditSkill />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// wrap with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
