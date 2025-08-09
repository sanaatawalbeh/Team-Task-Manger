import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Edit_Profile.css";
export default function EditProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    birth_date: "",
    gender: "",
    phone_number: "",
    profile_image: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:2666/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.put("http://localhost:2666/user/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="edit-profile-container">
      <Helmet>
        <title>TeamFlow | Edit Profile</title>
      </Helmet>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>Edit Your Profile</h2>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
        />

        <input
          type="text"
          name="profile_image"
          placeholder="Profile Image URL"
          value={form.profile_image}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
