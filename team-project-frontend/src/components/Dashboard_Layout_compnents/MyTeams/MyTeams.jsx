import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyTeams.css";
const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:2666/team/myteam", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(res.data);
      } catch (err) {
        setError("Failed to fetch your teams.");
        console.error(err);
      }
    };

    fetchMyTeams();
  }, []);

  return (
    <div className="my-teams-container">
      <Helmet>
        <title>TeamFlow | My Teams</title>
      </Helmet>
      <h2 className="my-teams-title">My Teams</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="team-count">
        You are in <span>{teams.length}</span> team
        {teams.length !== 1 && "s"}.
      </div>

      {teams.length === 0 ? (
        <p className="empty-message">You are not a member of any teams yet.</p>
      ) : (
        <div className="team-cards-grid">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-info">
                <h3>{team.name}</h3>
                <p>
                  Code: <strong>{team.code}</strong>
                </p>
                <p>
                  Role:{" "}
                  <span
                    className={`team-role ${
                      team.role === "leader" ? "leader" : "member"
                    }`}
                  >
                    {team.role}
                  </span>
                </p>
                <p className="created-at">
                  Created at:{" "}
                  {new Date(team.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="goToTeamwrapper">
                <button
                  className="go-to-team-btn"
                  onClick={() => {
                    localStorage.setItem("team_id", team.id);
                    localStorage.setItem("role", team.role);
                    localStorage.setItem("teamName", team.name);

                    if (team.role === "leader") {
                      navigate("/leaderlayout/teammembers");
                    } else {
                      navigate("/memberlayout/teammembers");
                    }
                  }}
                >
                  Go to Team Page
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeams;
