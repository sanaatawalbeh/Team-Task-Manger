import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  FaBars,
  FaTimes,
  FaUsers,
  FaArrowLeft,
  FaTasks,
  FaAngleDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAssignmentInd, MdGroups, MdAddTask } from "react-icons/md";

export default function Dashboard_Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false); // ✅ هذا السطر ضروري
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
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();

  const isSettingsRoute =
    location.pathname.includes("/editprofile") ||
    location.pathname.includes("/changepassword");

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
      console.error(err);
    }
  };
  return (
    <div className="dashboard-layout">
      {/* Toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <FaTimes className="sidebar-icon-close" />
        ) : (
          <FaBars className="sidebar-icon-open" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h5 className="logo">
          {teamName ? `Member Page - ${teamName}` : "Leader Page"}
        </h5>{" "}
        <nav className="dashboard-nav-links">
          <NavLink to="/memberlayout/teammembers" className="dash-link">
            <FaUsers /> <span>Team Members</span>
          </NavLink>

          <div className="settings-dropdown">
            <div
              className={`dash-link dropdown-toggle ${
                openSettings || isSettingsRoute ? "active" : ""
              }`}
              onClick={() => setOpenSettings((prev) => !prev)}
            >
              <FaTasks /> <span>Tasks Management</span>
              <span className={`arrow ${openSettings ? "rotate" : ""}`}>
                <FaAngleDown />
              </span>
            </div>

            <div className={`dropdown-menu ${openSettings ? "show" : ""}`}>
              <NavLink
                to="/memberlayout/mytasks"
                className="dash-link sub-link"
              >
                <MdAssignmentInd /> <span>My Tasks</span>
              </NavLink>

              <NavLink
                to="/memberlayout/allteamtasks"
                className="dash-link sub-link"
              >
                <MdGroups /> <span>Team Tasks</span>
              </NavLink>

              <NavLink
                to="/memberlayout/createtask"
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
                <p>Are you sure you want to leave this team?</p>
                <div className="leave-modal-actions">
                  <button onClick={handleLeaveTeam}>Leave</button>
                  <button onClick={() => setShowLeaveModal(false)}>
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
            <FaArrowLeft /> <span>Return to Dashboard </span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
