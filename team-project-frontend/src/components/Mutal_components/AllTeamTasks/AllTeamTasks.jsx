import { useEffect, useState } from "react";
import axios from "axios";
import "./AllTeamTasks.css"; // لو بدك تنسق
import defaultAvatar from "../../../Assets/defaukt.jpg";
import { FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa";

export default function AllTeamTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  //add comment
  const [newComments, setNewComments] = useState({});
  //view all comment
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // const currentUserName = localStorage.getItem("fullname");

  useEffect(() => {
    const fetchTeamTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2666/task/teamtasks?team_id=${teamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTasks(res.data);
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch tasks.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamTasks();
  }, [token]);

  const handleAddComment = async (taskId) => {
    const commentText = newCommentText.trim();
    if (!commentText) return;

    try {
      await axios.post(
        `http://localhost:2666/comment/create/${taskId}`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewCommentText("");
      fetchComments(taskId); // Refresh comments after adding
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add comment.");
    }
  };

  //view comments
  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(
        `http://localhost:2666/comment/showAll/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data);
      setSelectedTaskForComments(taskId);
      setShowCommentsModal(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to load comments.");
    }
  };
  //edit comments
  const handleEditComment = async (commentId, oldText) => {
    const newComment = prompt("Edit your comment:", oldText);
    if (!newComment || newComment.trim() === "") return;

    try {
      await axios.put(
        `http://localhost:2666/comment/editComment/${commentId}`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments(selectedTaskForComments); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Failed to edit comment.");
    }
  };

  //delete comments
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axios.delete(
        `http://localhost:2666/comment/deleteComment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments(selectedTaskForComments); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete comment.");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:2666/task/${taskToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      setTaskToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete task.");
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = e.target;

      const updatedTask = {
        title: form.title.value,
        description: form.description.value,
        due_date: form.due_date.value,
        priority: form.priority.value,
        status: form.status.value,
      };

      await axios.put(
        `http://localhost:2666/task/${taskToEdit.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...updatedTask } : t))
      );

      setShowEditModal(false);
      setTaskToEdit(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update the task.");
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="team-tasks-container">
      <h2>Team Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available for your team.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="assigned-header">
                {console.log({
                  created_by: task.created_by,
                  assigned_to: task.assigned_to,
                  userId: Number(userId),
                  role,
                })}
                <img
                  src={task.assigned_to_image || defaultAvatar}
                  alt={task.assigned_to_name}
                  className="assigned-avatar"
                />
                <span className="assigned-name">{task.assigned_to_name}</span>
              </div>

              <p>
                <strong>Title:</strong> {task.title}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {task.description || "No description"}
              </p>

              <div className="status-container">
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${task.status}`}>
                  {task.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(task.due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="created-by-info">
                <img
                  src={task.created_by_image || defaultAvatar}
                  alt={task.created_by_name}
                  className="created-by-avatar"
                />
                <span>Created by: {task.created_by_name}</span>
              </div>

              <div className="task-actions">
                <button
                  className="comment-task-team-btn"
                  onClick={() => fetchComments(task.id)}
                >
                  <FaRegCommentDots className="btn-icon" /> Comments
                </button>

                {(role === "leader" ||
                  (task.created_by === Number(userId)) &
                    (task.assigned_to === Number(userId))) && (
                  <button
                    className="delete-task-team-btn"
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash className="btn-icon" /> Delete
                  </button>
                )}

                {(role === "leader" ||
                  (task.created_by === Number(userId) &&
                    task.assigned_to === Number(userId))) && (
                  <button
                    className="edit-task-team-btn"
                    onClick={() => {
                      setTaskToEdit(task);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit className="btn-icon" /> Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteTask}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && taskToEdit && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                defaultValue={taskToEdit.title}
                required
              />
              <textarea
                name="description"
                defaultValue={taskToEdit.description}
              />
              <input
                type="date"
                name="due_date"
                defaultValue={taskToEdit.due_date?.split("T")[0]}
              />
              <select name="priority" defaultValue={taskToEdit.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select name="status" defaultValue={taskToEdit.status}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCommentsModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCommentsModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Comments</h3>

            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              <ul className="comment-list">
                {comments.map((c) => (
                  <li key={c.id} className="comment-item">
                    <img
                      src={c.profile_image || defaultAvatar}
                      alt={c.full_name}
                      className="comment-avatar"
                    />
                    <div>
                      <strong>{c.full_name}</strong>
                      <p>{c.comment}</p>
                      <small>{new Date(c.created_at).toLocaleString()}</small>
                      <div className="comment-actions">
                        <button
                          className="edit-comment-btn"
                          onClick={() => handleEditComment(c.id, c.comment)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="add-comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button onClick={() => handleAddComment(selectedTaskForComments)}>
                Send
              </button>
            </div>

            <button
              className="close-modal-btn"
              onClick={() => setShowCommentsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
