import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SkillList() {
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    const res = await axios.get('http://localhost:5000/api/skills');
    setSkills(res.data);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this skill?')) return;
    await axios.delete(`http://localhost:5000/api/skills/${id}`);
    fetchSkills();
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const username = localStorage.getItem('username');

  return (
    <div className="skill-list">
      {skills.map(skill => (
        <div className="skill-card" key={skill._id}>
          <h3>{skill.title}</h3>
          <p>{skill.description}</p>
          <p><strong>Category:</strong> {skill.category || 'N/A'}</p>
          <p><strong>Level:</strong> {skill.level || 'N/A'}</p>
          <p><strong>By:</strong> {skill.createdBy || 'Anonymous'}</p>
          {username === skill.createdBy && (
            <>
              <button onClick={() => navigate(`/edit/${skill._id}`)}>Edit</button>
              <button onClick={() => handleDelete(skill._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default SkillList;
