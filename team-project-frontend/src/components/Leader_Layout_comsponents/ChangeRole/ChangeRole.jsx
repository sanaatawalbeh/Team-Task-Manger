import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeRole.css";
import axios from "axios";

export default function ChangeRole() {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChangeRole = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const teamId = localStorage.getItem("team_id");
    const token = localStorage.getItem("token");

    if (!teamId || !token) {
      setError("Missing team ID or authentication token.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:2666/teamsmember/${teamId}/changerole`,
        {
          user_email: email,
          new_role: newRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Role updated successfully.");
      setEmail("");
      setNewRole("member");
      navigate("/leaderlayout/teammembers");
    } catch (err) {
      const apiError = err.response?.data?.error || "Something went wrong";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-role-card">
      <h2>Change Member Role</h2>

      <div className="form-group">
        <label>Member Email:</label>
        <input
          type="email"
          value={email}
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>New Role:</label>
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="leader">Leader</option>
        </select>
      </div>

      <div className="change-role-btn-wrraper">
        <button
          onClick={handleChangeRole}
          disabled={loading}
          className="change-role-btn"
        >
          {loading ? "Updating..." : "Update Role"}
        </button>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
