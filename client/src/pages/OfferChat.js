import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OfferChat() {
  const { id } = useParams(); // offerId
  const [offer, setOffer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const username = localStorage.getItem('username') || '';

  const loadOffer = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/offers/${id}`);
      setOffer(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadOffer(); loadMessages(); }, [id]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/messages', {
        offerId: id, sender: username, text
      });
      setText('');
      await loadMessages();
    } catch (err) {
      alert('Failed to send');
    }
  };

  if (!offer) return <div style={{ padding: 16 }}>Loading offer…</div>;

  return (
    <main>
      <div className="skill-card">
        <h3>Offer Chat</h3>
        <p><strong>From:</strong> {offer.proposer} → <strong>To:</strong> {offer.receiver}</p>
        <p><strong>I teach:</strong> {offer.proposeSkillTitle}</p>
        <p><strong>I want:</strong> {offer.requestSkillTitle}</p>
        <p><strong>Status:</strong> {offer.status}</p>
      </div>

      <div className="skill-card" style={{ maxHeight: 300, overflowY: 'auto' }}>
        {messages.map(m => (
          <div key={m._id} style={{ marginBottom: 8 }}>
            <strong>{m.sender}:</strong> {m.text} <span style={{ color: '#777' }}>({new Date(m.createdAt).toLocaleString()})</span>
          </div>
        ))}
      </div>

      <form onSubmit={send}>
        <input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

export default OfferChat;
