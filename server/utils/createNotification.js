import Notification from "../models/notification.js";

/**
 * Create a notification for a specific user
 * @param {string} userId - MongoDB User ID
 * @param {string} message - Notification message
 */
export const createNotification = async (userId, message) => {
  try {
    const note = new Notification({ user: userId, message });
    await note.save();
    return note;
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};
