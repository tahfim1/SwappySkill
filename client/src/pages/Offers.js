import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Offers() {
  const [offers, setOffers] = useState([]);
  const username = localStorage.getItem('username') || '';
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/offers?username=${encodeURIComponent(username)}`);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, path) => {
    try {
      await axios.put(`http://localhost:5000/api/offers/${id}/${path}`);
      await load();
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <main className="skill-list">
      <div className="skill-card">
        <Link to="/offers/new">Create New Offer</Link>
      </div>

      {offers.map(o => (
        <div className="skill-card" key={o._id}>
          <h3>Trade Offer</h3>
          <p><strong>From:</strong> {o.proposer} → <strong>To:</strong> {o.receiver}</p>
          <p><strong>I teach:</strong> {o.proposeSkillTitle}</p>
          <p><strong>I want:</strong> {o.requestSkillTitle}</p>
          <p><strong>Status:</strong> {o.status}</p>

          <div style={{ marginTop: 8 }}>
            <button onClick={() => navigate(`/offers/${o._id}`)}>Open Chat</button>{" "}
            {username === o.receiver && o.status === 'Proposed' && (
              <>
                <button onClick={() => act(o._id, 'accept')}>Accept</button>{" "}
                <button onClick={() => act(o._id, 'reject')}>Reject</button>
              </>
            )}
            {(username === o.receiver || username === o.proposer) && o.status === 'Proposed' && (
              <button onClick={() => act(o._id, 'cancel')}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default Offers;
