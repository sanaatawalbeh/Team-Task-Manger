import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaUsersCog,
  FaUserPlus,
  FaUserMinus,
  FaExchangeAlt,
  FaDoorOpen,
  FaArrowLeft,
  FaAngleDown,
  FaTasks,
  FaPlus,
} from "react-icons/fa";
import "./LeaderLayout.css";

export default function Dashboard_Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTeamSettings, setOpenTeamSettings] = useState(false);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isSettingsRoute =
    location.pathname.includes("/addmember") ||
    location.pathname.includes("/removemember") ||
    location.pathname.includes("/changerole") ||
    location.pathname.includes("/leaveteam") ||
    location.pathname.includes("/createtask");

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
        <h2 className="logo">Leader Page</h2>
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
              <NavLink
                to="/leaderlayout/leaveteam"
                className="dash-link sub-link"
              >
                <FaDoorOpen /> <span>Leave Team</span>
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
                <FaPlus /> <span>My Tasks</span>
              </NavLink>

              <NavLink
                to="/leaderlayout/allteamtasks"
                className="dash-link sub-link"
              >
                <FaPlus /> <span>Team Tasks</span>
              </NavLink>

              <NavLink
                to="/leaderlayout/createtask"
                className="dash-link sub-link"
              >
                <FaPlus /> <span>New Task</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/leaderlayout/leaveteam" className="dash-link sub-link">
            <FaDoorOpen /> <span>Leave Team</span>
          </NavLink>

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
