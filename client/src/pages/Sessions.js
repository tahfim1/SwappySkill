import { useEffect, useState } from 'react';
import axios from 'axios';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const username = localStorage.getItem('username') || '';

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sessions?username=${encodeURIComponent(username)}`);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, path) => {
    try {
      await axios.put(`http://localhost:5000/api/sessions/${id}/${path}`);
      await load();
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <main className="skill-list">
      {sessions.map(s => (
        <div className="skill-card" key={s._id}>
          <h3>{s.skillTitle}</h3>
          <p><strong>Owner (teacher):</strong> {s.ownerUsername}</p>
          <p><strong>Requester (learner):</strong> {s.requesterUsername}</p>
          <p><strong>When:</strong> {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : '—'}</p>
          <p><strong>Status:</strong> {s.status}</p>

          {/* Actions */}
          <div style={{ marginTop: 8 }}>
            {username === s.ownerUsername && s.status === 'Pending' && (
              <button onClick={() => act(s._id, 'accept')}>Accept</button>
            )}
            {(username === s.ownerUsername || username === s.requesterUsername) && s.status !== 'Cancelled' && s.status !== 'Completed' && (
              <button onClick={() => act(s._id, 'cancel')}>Cancel</button>
            )}
            {username === s.ownerUsername && s.status === 'Accepted' && (
              <button onClick={() => act(s._id, 'complete')}>Mark Complete</button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default Sessions;
