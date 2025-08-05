import { useState, useEffect } from "react";
import axios from "axios";
import "./CreateTask.css";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");
  const userId = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("role"); 
  useEffect(() => {
    if (userRole === "leader") {
      axios
        .get(`http://localhost:2666/teamsmember/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMembers(res.data))
        .catch((err) => console.error("Error fetching members:", err));
    }
  }, [teamId, token, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      team_id: teamId,
      title,
      description,
      due_date: dueDate,
      priority,
      assigned_to: userRole === "leader" ? assignedTo : userId,
    };

    try {
      const res = await axios.post(
        "http://localhost:2666/task/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setAssignedTo("");
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong.";
      setError(msg);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create a New Task</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label className="task-label">
          Deadline:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </label>

        <label className="task-label">
          Priority:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low – Not urgent</option>
            <option value="medium">Medium – Normal</option>
            <option value="high">High – Needs attention</option>
          </select>
        </label>

        {userRole === "leader" && (
          <label className="task-label">
            Assign to:
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.full_name} ({m.role})
                </option>
              ))}
            </select>
          </label>
        )}

        <button type="submit">Create Task</button>
      </form>

      {message && <p className="task-success">{message}</p>}
      {error && <p className="task-error">{error}</p>}
    </div>
  );
}
