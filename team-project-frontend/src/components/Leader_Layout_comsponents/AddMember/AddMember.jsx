import { useState } from "react";
import axios from "axios";
import "./AddMember.css";

export default function AddMember() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    const teamId = localStorage.getItem("team_id");

    try {
      const res = await axios.post(
        `http://localhost:2666/teamsmember/${teamId}/addmember`,
        { user_email: email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setEmail("");
      setRole("member");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="add-member-container">
      <h2>Add Team Member</h2>
      <form onSubmit={handleAddMember} className="add-member-form">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="leader">Leader</option>
        </select>

        <button type="submit">Add Member</button>
      </form>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
