import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./LeaveTeam.css";

export default function LeaveTeam() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");

  const handleLeaveTeam = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:2666/teamsmember/${teamId}/leave`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setShowModal(false);
      localStorage.removeItem("team_id");
      navigate("/dashboard/main");
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong while leaving.";
      setError(errMsg);
      setShowModal(false);
    }
  };

  return (
    <div className="leave-team-wrapper">
      <h3 className="leave-team-note">
        We are sorry to see that. Before you leave, you can contact our leader
        if there is a problem.
      </h3>

      <button className="leave-team-button" onClick={() => setShowModal(true)}>
        Leave Team
      </button>

      {showModal && (
        <div className="leave-modal-backdrop">
          <div className="leave-modal">
            <p className="leave-modal-text">
              Are you sure you want to leave the team?
            </p>
            <div className="leave-modal-actions">
              <button className="leave-confirm-btn" onClick={handleLeaveTeam}>
                Yes, Leave
              </button>
              <button
                className="leave-cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="leave-success-msg">{message}</p>}
      {error && <p className="leave-error-msg">{error}</p>}
    </div>
  );
}
