import { NavLink } from "react-router-dom";
// import Home from "../../Home/Home";
// import About from "../../About/About";
// import Register from "../../Register/Register"
// import Login from "../../Login/Login";

import "./Navbar.css";

export default function Navbar() {
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">TeamFlow</div>
        <div className="public-nav-links">
          <NavLink to="/" className="nav-btn">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-btn">
            About
          </NavLink>
          <NavLink to="/register" className="nav-btn-register">
            Register
          </NavLink>
        </div>
      </nav>
      {/* 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes> */}
    </>
  );
}
