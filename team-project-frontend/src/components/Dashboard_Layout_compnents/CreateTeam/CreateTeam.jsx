import { Helmet } from "react-helmet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTeam.css";

export default function CreateTeam() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2666/team/create",
        { name, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Team "${response.data.name}" created successfully!`);
      setName("");
      setCode("");
      navigate("/dashboard/myteam");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="team-container">
      <Helmet>
        <title>TeamFlow | Create Team</title>
      </Helmet>
      <h2 className="team-title">Create a New Team</h2>
      <p className="team-motivation">
        Great things happen when people collaborate. Build your team, lead the
        way, and achieve more together!
      </p>
      <form onSubmit={handleCreate} className="team-form">
        <div>
          <label>Team Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Frontend Avengers"
          />
        </div>

        <div>
          <label>Team Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="e.g. CODE2025"
          />
        </div>

        <button type="submit">Create Team</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
