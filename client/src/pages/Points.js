import { useEffect, useState } from 'react';
import axios from 'axios';

function Points() {
  const [balance, setBalance] = useState(0);
  const [tx, setTx] = useState([]);
  const username = localStorage.getItem('username') || '';

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/points/balance/${encodeURIComponent(username)}`);
      setBalance(res.data.balance || 0);
      setTx(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <main>
      <div className="skill-card">
        <h3>Points Balance: {balance}</h3>
      </div>
      <div className="skill-card">
        <h3>Recent Transactions</h3>
        {tx.map(t => (
          <div key={t._id} style={{ marginBottom: 6 }}>
            <strong>{t.type.toUpperCase()}</strong> {t.amount} — {t.note} <span style={{ color: '#777' }}>({new Date(t.createdAt).toLocaleString()})</span>
          </div>
        ))}
        {tx.length === 0 && <p>No transactions yet.</p>}
      </div>
    </main>
  );
}

export default Points;
