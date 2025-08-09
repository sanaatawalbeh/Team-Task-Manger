import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaUsersCog,
  FaUserPlus,
  FaUserMinus,
  FaExchangeAlt,
  FaArrowLeft,
  FaAngleDown,
  FaTasks,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAssignmentInd, MdGroups, MdAddTask } from "react-icons/md";
import "./LeaderLayout.css";

export default function LeaderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTeamSettings, setOpenTeamSettings] = useState(false);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const storedTeamName = localStorage.getItem("teamName");
    if (storedTeamName) {
      setTeamName(storedTeamName);
    }
  }, []);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team_id");
  const handleLeaveTeam = async () => {
    try {
      await axios.delete(`http://localhost:2666/teamsmember/${teamId}/leave`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("team_id");
      setShowLeaveModal(false);
      navigate("/dashboard/myteam");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error); // يظهر الرسالة من السيرفر
      } else {
        console.error(err);
      }
    }
  };

  const isSettingsRoute =
    location.pathname.includes("/addmember") ||
    location.pathname.includes("/removemember") ||
    location.pathname.includes("/changerole") ||
    location.pathname.includes("/leaveteam") ||
    location.pathname.includes("/createtask");

  return (
    <div className="dashboard-layout">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <FaTimes className="sidebar-icon-close" />
        ) : (
          <FaBars className="sidebar-icon-open" />
        )}
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h5 className="logo">
          {teamName ? `Leader Page - ${teamName}` : "Leader Page"}
        </h5>
        <nav className="dashboard-nav-links">
          <NavLink to="/leaderlayout/teammembers" className="dash-link">
            <FaUsers /> <span>Team Members</span>
          </NavLink>

          {/* Team Management Dropdown */}
          <div className="settings-dropdown">
            <div
              className={`dash-link dropdown-toggle ${
                openTeamSettings || isSettingsRoute ? "active" : ""
              }`}
              onClick={() => setOpenTeamSettings((prev) => !prev)}
            >
              <FaUsersCog /> <span>Team Management</span>
              <span className={`arrow ${openTeamSettings ? "rotate" : ""}`}>
                <FaAngleDown />
              </span>
            </div>

            <div className={`dropdown-menu ${openTeamSettings ? "show" : ""}`}>
              <NavLink
                to="/leaderlayout/addmember"
                className="dash-link sub-link"
              >
                <FaUserPlus /> <span>Add Member</span>
              </NavLink>
              <NavLink
                to="/leaderlayout/removemember"
                className="dash-link sub-link"
              >
                <FaUserMinus /> <span>Remove Member</span>
              </NavLink>
              <NavLink
                to="/leaderlayout/changerole"
                className="dash-link sub-link"
              >
                <FaExchangeAlt /> <span>Change Role</span>
              </NavLink>
            </div>
          </div>

          {/* Task Management Dropdown */}
          <div className="settings-dropdown">
            <div
              className="dash-link dropdown-toggle"
              onClick={() => setOpenTaskSettings((prev) => !prev)}
            >
              <FaTasks /> <span>Tasks Management</span>
              <span className={`arrow ${openTaskSettings ? "rotate" : ""}`}>
                <FaAngleDown />
              </span>
            </div>

            <div className={`dropdown-menu ${openTaskSettings ? "show" : ""}`}>
              <NavLink
                to="/leaderlayout/mytasks"
                className="dash-link sub-link"
              >
                <MdAssignmentInd /> <span>My Tasks</span>
              </NavLink>

              <NavLink
                to="/leaderlayout/allteamtasks"
                className="dash-link sub-link"
              >
                <MdGroups /> <span>Team Tasks</span>
              </NavLink>

              <NavLink
                to="/leaderlayout/createtask"
                className="dash-link sub-link"
              >
                <MdAddTask /> <span>New Task</span>
              </NavLink>
            </div>
          </div>

          <button
            className={`dash-link sub-link ${showLeaveModal ? "active" : ""}`}
            onClick={() => setShowLeaveModal(true)}
          >
            <FaSignOutAlt /> <span>Leave Team</span>
          </button>

          {showLeaveModal && (
            <div className="leave-modal-backdrop">
              <div className="leave-modal">
                <h3 className="leave-modal-title">Leave Team</h3>
                <p className="leave-modal-text">
                  Are you sure you want to leave this team?
                </p>
                <div className="leave-modal-actions">
                  <button className="leave-btn" onClick={handleLeaveTeam}>
                    Leave
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            className="signout-btn"
            onClick={() => navigate("/dashboard/myteam")}
          >
            <FaArrowLeft /> <span>Return to Dashboard</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
