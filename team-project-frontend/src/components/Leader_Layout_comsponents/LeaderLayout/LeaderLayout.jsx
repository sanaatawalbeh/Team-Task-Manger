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
} from "react-icons/fa";
import "./LeaderLayout.css";

export default function Dashboard_Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();

  const isSettingsRoute =
    location.pathname.includes("/ِaddmemver") ||
    location.pathname.includes("/removemember");
  location.pathname.includes("/changerole");
  location.pathname.includes("/leaveteam");

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

          <div className="settings-dropdown">
            <div
              className={`dash-link dropdown-toggle ${
                openSettings || isSettingsRoute ? "active" : ""
              }`}
              onClick={() => setOpenSettings((prev) => !prev)}
            >
              <FaUsersCog /> <span>Team Management</span>
              <span className={`arrow ${openSettings ? "rotate" : ""}`}>
                <FaAngleDown />
              </span>{" "}
            </div>

            <div className={`dropdown-menu ${openSettings ? "show" : ""}`}>
              <NavLink
                to="/leaderlayout/addmember"
                className="dash-link sub-link"
              >
                <FaUserPlus /> <span>Add member</span>
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

          <button className="signout-btn" onClick={() => navigate("/")}>
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
