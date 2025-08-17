import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function NewOffer() {
  const navigate = useNavigate();
  const q = useQuery();
  const presetReceiver = q.get('to') || '';
  const presetSkill = q.get('skill') || '';

  const [form, setForm] = useState({
    receiver: presetReceiver,
    proposeSkillTitle: '',
    requestSkillTitle: presetSkill
  });

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) navigate('/login');
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const proposer = localStorage.getItem('username');
      await axios.post('http://localhost:5000/api/offers', {
        proposer,
        receiver: form.receiver,
        proposeSkillTitle: form.proposeSkillTitle,
        requestSkillTitle: form.requestSkillTitle
      });
      alert('Offer sent!');
      navigate('/offers');
    } catch (err) {
      alert('Failed to create offer');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Propose Trade</h2>

      <label>Receiver (username)</label>
      <input name="receiver" value={form.receiver} onChange={handleChange} required />

      <label>Your Skill (you teach)</label>
      <input name="proposeSkillTitle" value={form.proposeSkillTitle} onChange={handleChange} required />

      <label>Their Skill (you want)</label>
      <input name="requestSkillTitle" value={form.requestSkillTitle} onChange={handleChange} required />

      <button type="submit">Send Offer</button>
    </form>
  );
}

export default NewOffer;
