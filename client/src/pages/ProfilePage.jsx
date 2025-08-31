import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage({ currentUserId }) {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [location, setLocation] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${currentUserId}`);
      setUser(res.data);
      setBio(res.data.bio || "");
      setBloodGroup(res.data.bloodGroup || "");
      setStudyLevel(res.data.studyLevel || "");
      setLocation(res.data.location || "");
    } catch (err) { console.error(err); }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ratings/${currentUserId}`);
      setAverageRating(res.data.average);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProfile();
    fetchAverageRating();
  }, [currentUserId]);

  const saveProfile = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${currentUserId}`, { bio, bloodGroup, studyLevel, location });
      setUser(res.data);
      setEditMode(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="profile-container p-6 max-w-lg mx-auto page-container">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      {editMode ? (
        <div className="flex flex-col gap-3">
          <textarea placeholder="Your bio..." value={bio} onChange={(e) => setBio(e.target.value)} className="border rounded px-2 py-1 w-full"/>
          <input type="text" placeholder="Blood Group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="border rounded px-2 py-1 w-full"/>
          <input type="text" placeholder="Study Level" value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)} className="border rounded px-2 py-1 w-full"/>
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded px-2 py-1 w-full"/>
          <div className="flex gap-2 mt-2">
            <button onClick={saveProfile} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Blood Group:</strong> {user.bloodGroup || "-"}</p>
          <p><strong>Study Level:</strong> {user.studyLevel || "-"}</p>
          <p><strong>Location:</strong> {user.location || "-"}</p>
          <p><strong>Average Rating:</strong> ⭐ {averageRating}</p>
          <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Edit Profile</button>
        </div>
      )}
    </div>
  );
}
