import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddSkill() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    level: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) navigate('/login');
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/skills', {
        ...form,
        createdBy: localStorage.getItem('username')
      });
      navigate('/');
    } catch (err) {
      alert('Error adding the skill');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Skill</h2>
      <input name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="level" placeholder="Level (e.g., Beginner)" onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddSkill;
