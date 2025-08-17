import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function BookSession() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const loadSkill = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/skills');
        const found = res.data.find(s => s._id === skillId);
        setSkill(found || null);
      } catch (err) {
        console.error(err);
      }
    };
    loadSkill();
  }, [skillId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requesterUsername = localStorage.getItem('username');
      await axios.post('http://localhost:5000/api/sessions', {
        skillId,
        scheduledAt,
        requesterUsername
      });
      alert('Session requested! Waiting for owner to accept.');
      navigate('/sessions');
    } catch (err) {
      alert('Failed to request session');
    }
  };

  if (!skill) return <div style={{ padding: 16 }}>Loading skill…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book: {skill.title}</h2>
      <label>Pick a date & time</label>
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        required
      />
      <button type="submit">Request Session</button>
    </form>
  );
}

export default BookSession;
