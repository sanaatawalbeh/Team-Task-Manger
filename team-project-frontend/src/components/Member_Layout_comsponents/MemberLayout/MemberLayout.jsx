import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaDoorOpen,
  FaArrowLeft,
  FaTasks,
  FaAngleDown,
  FaPlusSquare,
  FaPlus,
} from "react-icons/fa";

export default function Dashboard_Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();

  const isSettingsRoute =
    location.pathname.includes("/editprofile") ||
    location.pathname.includes("/changepassword");

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
        <h2 className="logo">Member Page</h2>
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
                to="/memberlayout/createtask"
                className="dash-link sub-link"
              >
                <FaPlus /> <span>New Task</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/memberlayout/leaveteam" className="dash-link sub-link">
            <FaDoorOpen /> <span>Leave Team</span>
          </NavLink>

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
