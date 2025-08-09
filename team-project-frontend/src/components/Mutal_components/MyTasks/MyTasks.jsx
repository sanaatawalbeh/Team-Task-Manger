import { useEffect, useState } from "react";
import axios from "axios";
import "./MyTasks.css"; // نسق زي ما بدك
import defaultAvatar from "../../../Assets/defaukt.jpg";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEditStatus, setTaskToEditStatus] = useState(null);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");
  const userId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2666/task/mytasks?team_id=${teamId}`,
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

    fetchMyTasks();
  }, [token, teamId]);

  if (loading) return <p>Loading your tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:2666/task/${taskToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      setTaskToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      alert(
        err.response?.data?.error || "You are not allowed to delete this task."
      );
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

  const handleEditStatusSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = e.target;
      const newStatus = form.status.value;

      await axios.put(
        `http://localhost:2666/task/${taskToEditStatus.id}/editstatus`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskToEditStatus.id ? { ...t, status: newStatus } : t
        )
      );

      setShowEditStatusModal(false);
      setTaskToEditStatus(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update task status.");
    }
  };

  return (
    <div className="my-tasks-container">
      <h2>My Tasks in Current Team</h2>
      {tasks.length === 0 ? (
        <p>You have no assigned tasks in this team.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
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
                {task.created_by === userId && (
                  <button
                    className="edit-task-team-btn"
                    onClick={() => {
                      setTaskToEdit(task);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="edit-task-team-btn"
                  onClick={() => {
                    setTaskToEditStatus(task);
                    setShowEditStatusModal(true);
                  }}
                >
                  Edit Status
                </button>

                {(task.created_by === userId || role === "leader") && (
                  <button
                    className="delete-task-team-btn"
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
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
      {showEditStatusModal && taskToEditStatus && (
        <div
          className="modal-backdrop"
          onClick={() => setShowEditStatusModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task Status</h3>
            <form onSubmit={handleEditStatusSubmit}>
              <select
                name="status"
                defaultValue={taskToEditStatus.status}
                required
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => setShowEditStatusModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
