import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function RatingPage({ currentUserId }) {
  const { targetUserId } = useParams(); // userId from route
  const [ratings, setRatings] = useState([]);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [average, setAverage] = useState(0);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ratings/${targetUserId}`);
      setRatings(res.data.ratings);
      setAverage(res.data.average);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [targetUserId]);

  const submitRating = async () => {
    if (currentUserId === targetUserId) {
      alert("Cannot rate yourself");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/ratings", {
        from: currentUserId,
        to: targetUserId,
        score,
        comment,
      });
      setScore(0);
      setComment("");
      fetchRatings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to submit rating");
    }
  };

  return (
    <div className="page-container">
      <h2>Rate this user</h2>
      <p>Average Rating: ⭐ {average}</p>
      <input type="number" min="1" max="5" value={score} onChange={e => setScore(Number(e.target.value))}/>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment"/>
      <button onClick={submitRating}>Submit Rating</button>

      <h3>All Ratings</h3>
      {ratings.length === 0 ? <p>No ratings yet</p> : ratings.map(r => (
        <div key={r._id}>
          <strong>{r.from?.username}</strong>: ⭐ {r.score}
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
