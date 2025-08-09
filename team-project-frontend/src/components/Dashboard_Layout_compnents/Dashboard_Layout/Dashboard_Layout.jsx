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
  FaAngleDown,
  FaTrash,
} from "react-icons/fa";
import "./Dashboard_Layout.css";

export default function Dashboard_Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();

  // const handleDeleteMyAccount = async () => {
  //   const password = prompt("Please enter your password to confirm deletion:");
  //   if (!password) return;

  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete your account? This action is irreversible."
  //     )
  //   )
  //     return;

  //   try {
  //     const res = await fetch("http://localhost:2666/user/deleteMyAccount", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ password }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.error || "Failed to delete account.");
  //     }

  //     alert("Your account has been deleted.");

  //     // Logout the user
  //     localStorage.clear();
  //     window.location.href = "/login"; // or use navigate("/login") if you're using react-router
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

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

          <NavLink to="/dashboard/myteam" className="dash-link">
            <FaUsers /> <span>My Teams</span>
          </NavLink>

          <NavLink to="/dashboard/createteam/" className="dash-link">
            <FaPlusCircle /> <span>Create Team</span>
          </NavLink>

          <NavLink to="/dashboard/jointeam" className="dash-link">
            <FaUsers /> <span>Join Existing Team</span>
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
              <span className={`arrow ${openSettings ? "rotate" : ""}`}>
                <FaAngleDown />
              </span>
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

              {/* <button
                className="dash-link sub-link delete-account-btn"
                onClick={handleDeleteMyAccount}
              >
                <FaTrash /> <span>Delete My Account</span>
              </button> */}
            </div>
          </div>

          <button className="signout-btn" onClick={() => setShowModal(true)}>
            <FaSignOutAlt /> <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Sign out of your account?</h3>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("team_id");
                  localStorage.removeItem("role");
                  localStorage.removeItem("userId");

                  navigate("/login");
                }}
              >
                Sign out
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
