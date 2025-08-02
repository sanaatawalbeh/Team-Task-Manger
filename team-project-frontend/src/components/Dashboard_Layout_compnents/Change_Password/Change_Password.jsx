import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Change_Password.css";

export default function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

     if (form.new_password !== form.confirm_password) {
       return setError("Passwords do not match.");
     }
    try {
      await axios.put("http://localhost:2666/user/changePassword", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Password changed successfully.");
      setTimeout(() => navigate("/dashboard/profile"), 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>

        <input
          type="password"
          name="old_password"
          placeholder="Current Password"
          value={form.old_password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          value={form.new_password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm New Password"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
