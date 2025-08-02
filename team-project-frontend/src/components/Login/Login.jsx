import React, { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage("");

    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await axios.post(
          "http://localhost:2666/user/login",
          formData
        );
        const token = res.data.token;

        setModalMessage(" Login successful!");
        localStorage.setItem("token", token);

        navigate("/dashboard/main");

      } catch (err) {
        if (err.response?.status === 404) {
          setModalMessage(" Email not found.");
        } else if (err.response?.status === 401) {
          setModalMessage(" Incorrect password.");
        } else {
          setModalMessage(" Login failed.");
        }
      } finally {
        setLoading(false);
        setShowModal(true);
      }
    }, 1000);
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h2>Welcome Back</h2>
        <p>
          Log in to manage your tasks, collaborate with your team, and track
          progress efficiently.
        </p>
      </div>

      <div className="register-right">
        <h2>Log In</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="login-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
