import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditSkill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    level: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) navigate('/login');

    const fetchSkill = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/skills/${id}`);
        setForm(res.data);
      } catch (err) {
        alert('Error loading skill');
      }
    };

    fetchSkill();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/skills/${id}`, form);
      navigate('/');
    } catch (err) {
      alert('Error updating skill');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Skill</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <input
        name="level"
        placeholder="Level (e.g., Beginner)"
        value={form.level}
        onChange={handleChange}
      />
      <button type="submit">Update Skill</button>
    </form>
  );
}

export default EditSkill;
