import { useState } from "react";
import axios from "axios";
import "./RemoveMember.css";

export default function RemoveMember() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRemove = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    const teamId = localStorage.getItem("team_id");

    try {
      const res = await axios.delete(
        `http://localhost:2666/teamsmember/${teamId}/removemember`,
        {
          data: { user_email: email },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="remove-member-container">
      <h2>Remove Team Member</h2>
      <form onSubmit={handleRemove} className="remove-member-form">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Remove Member</button>
      </form>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
