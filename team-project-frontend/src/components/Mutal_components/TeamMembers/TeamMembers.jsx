import { useEffect, useState } from "react";
import axios from "axios";
import defaultAvatar from "../../../Assets/defaukt.jpg";

import "./TeamMembers.css";

export default function TeamMembers() {
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const teamId = localStorage.getItem("team_id");

    const fetchLeaders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2666/teamsmember/${teamId}/leaders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2666/teamsmember/${teamId}/members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        } else {
          setMembers([]); // fallback for { message, data } shape
        }
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };

    fetchLeaders();
    fetchMembers();
  }, []);

  return (
    <div className="myteam-container">
      <h2 className="section-title">Our Leaders</h2>
      <div className="card-list">
        {leaders.map((leader) => (
          <div key={leader.id} className="member-card">
            <img
              src={leader.profile_image || defaultAvatar}
              alt="avatar"
              className="avatar"
            />
            <h3>{leader.full_name}</h3>
            <p>{leader.email}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Team Members</h2>
      <div className="card-list">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <img
              src={member.profile_image || defaultAvatar}
              alt="avatar"
              className="avatar"
            />
            <h3>{member.full_name}</h3>
            <p>{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
