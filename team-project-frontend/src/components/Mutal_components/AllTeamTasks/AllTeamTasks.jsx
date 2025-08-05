import { useEffect, useState } from "react";
import axios from "axios";
import "./AllTeamTasks.css"; // لو بدك تنسق
import defaultAvatar from "../../../Assets/defaukt.jpg";

export default function AllTeamTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");

  useEffect(() => {
    const fetchTeamTasks = async () => {
      try {
       const res = await axios.get(
         `http://localhost:2666/task/teamtasks?team_id=${teamId}`, // ✅ تمرير team_id
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
              <div className="assigned-to">
                <img
                  src={task.assigned_to_image || defaultAvatar}
                  alt={task.assigned_to_name}
                />

                <span className="assigned-to-name">
                  {task.assigned_to_name}
                </span>
              </div>

              <h3 className="task-title">{task.title}</h3>

              <p className="task-description">
                {task.description || "No description"}
              </p>

              <div className="task-bottom-info">
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </span>
                <span className="due-date">
                  {new Date(task.due_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="created-by">
                {task.created_by_image && (
                  <img src={task.created_by_image} alt={task.created_by_name} />
                )}
                <span>Created by: {task.created_by_name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
