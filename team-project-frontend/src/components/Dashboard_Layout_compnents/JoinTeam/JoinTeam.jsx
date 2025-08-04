import { useState } from "react";
import axios from "axios";
import "./JoinTeam.css";

const JoinTeam = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:2666/team/join",
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setCode("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="join-container">
      <h2 className="join-title">Join a Team</h2>
      <p className="join-motivation">
        Joining a team means joining forces. Enter your team code and become
        part of something bigger!
      </p>

      <input
        type="text"
        placeholder="Enter team code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="join-input"
      />

      <button onClick={handleJoin} className="join-button">
        Join Team
      </button>

      {message && <p className="join-success">{message}</p>}
      {error && <p className="join-error">{error}</p>}
    </div>
  );
};

export default JoinTeam;
