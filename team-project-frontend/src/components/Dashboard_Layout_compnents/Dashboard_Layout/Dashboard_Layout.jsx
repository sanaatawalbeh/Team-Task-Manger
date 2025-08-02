import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaEdit,
  FaLock,
  FaPlusCircle,
  FaUsers,
  FaCog,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import "./Dashboard_Layout.css";

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
        <h2 className="logo">TeamFlow</h2>
        <nav className="dashboard-nav-links">
          <NavLink to="/dashboard/main" className="dash-link">
            <FaHome /> <span>Home</span>
          </NavLink>

          <NavLink to="/dashboard/profile" className="dash-link">
            <FaUser /> <span>My Profile</span>
          </NavLink>

          <div className="settings-dropdown">
            <div
              className={`dash-link dropdown-toggle ${
                openSettings || isSettingsRoute ? "active" : ""
              }`}
              onClick={() => setOpenSettings((prev) => !prev)}
            >
              <FaCog />
              <span>Settings</span>
              <span className={`arrow ${openSettings ? "rotate" : ""}`}>▼</span>
            </div>

            <div className={`dropdown-menu ${openSettings ? "show" : ""}`}>
              <NavLink
                to="/dashboard/editprofile"
                className="dash-link sub-link"
              >
                <FaEdit /> <span>Edit Profile</span>
              </NavLink>
              <NavLink
                to="/dashboard/changepassword"
                className="dash-link sub-link"
              >
                <FaLock /> <span>Change Password</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/dashboard/createteam/" className="dash-link">
            <FaPlusCircle /> <span>Create Team</span>
          </NavLink>

          <NavLink to="/dashboard/" className="dash-link">
            <FaUsers /> <span>Join Existing Team</span>
          </NavLink>

          <NavLink to="/dashboard/notifications" className="dash-link">
            <FaBell /> <span>Notifications</span>
          </NavLink>

          <NavLink to="/dashboard/messages" className="dash-link">
            <FaEnvelope /> <span>Messages</span>
          </NavLink>

          <button className="signout-btn" onClick={() => navigate("/")}>
            <FaSignOutAlt /> <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
