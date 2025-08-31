import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationsPage({ currentUserId }) {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/notifications/${currentUserId}`)
      .then((res) => setNotifs(res.data))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, [currentUserId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifs((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto page-container">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifs.length === 0 && <p>No notifications yet.</p>}
      {notifs.map((n) => (
        <div
          key={n._id}
          className={`notification-card ${n.read ? "read" : "unread"}`}
        >
          <p>{n.message}</p>
          {!n.read && (
            <button
              onClick={() => markAsRead(n._id)}
              className="text-sm text-blue-600 mt-1"
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
