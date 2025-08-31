import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function SkillList() {
  const [skills, setSkills] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const username = localStorage.getItem("username") || "";
  const currentUserId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills");
        setSkills(res.data);

        // Fetch average ratings for all skill creators
        const creators = [...new Set(res.data.map(s => s.createdBy))];
        const ratingsData = {};
        await Promise.all(
          creators.map(async (user) => {
            if (user) {
              const userRes = await axios.get(`http://localhost:5000/api/users/username/${user}`);
              const userId = userRes.data._id;
              const ratingRes = await axios.get(`http://localhost:5000/api/ratings/${userId}`);
              ratingsData[user] = ratingRes.data.average;
            }
          })
        );
        setUserRatings(ratingsData);
      } catch (err) {
        console.error("Error fetching skills", err);
      }
    };
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete skill");
    }
  };

  const handleBook = (skill) => {
    if (!username) return navigate("/login");
    navigate(`/book/${skill._id}`);
  };

  const handleProposeTrade = (skill) => {
    if (!username) return navigate("/login");
    navigate(`/offers/new?to=${encodeURIComponent(skill.createdBy)}&skill=${encodeURIComponent(skill.title)}`);
  };

  const handleRateUser = async (skill) => {
    if (!username) return navigate("/login");
    try {
      const res = await axios.get(`http://localhost:5000/api/users/username/${skill.createdBy}`);
      const targetUserId = res.data._id;
      if (targetUserId === currentUserId) {
        alert("Cannot rate yourself");
        return;
      }
      navigate(`/rating/${targetUserId}`);
    } catch (err) {
      console.error("Failed to get user ID", err);
    }
  };

  return (
    <main className="skill-list">
      {skills.map(skill => (
        <div className="skill-card" key={skill._id}>
          <h3>{skill.title}</h3>
          <p>{skill.description}</p>
          <p><strong>Category:</strong> {skill.category || "N/A"}</p>
          <p><strong>Level:</strong> {skill.level || "N/A"}</p>
          <p>
            <strong>By:</strong> {skill.createdBy || "Anonymous"}{" "}
            {userRatings[skill.createdBy] ? `⭐ ${userRatings[skill.createdBy]}` : ""}
          </p>
          <div style={{ marginTop: 8 }}>
            {username === skill.createdBy ? (
              <>
                <Link to={`/edit/${skill._id}`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(skill._id)}>Delete</button>
              </>
            ) : (
              <>
                <button onClick={() => handleBook(skill)}>Book Session</button>{" "}
                <button onClick={() => handleProposeTrade(skill)}>Propose Trade</button>{" "}
                <button onClick={() => handleRateUser(skill)}>Rate User</button>
              </>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default SkillList;
