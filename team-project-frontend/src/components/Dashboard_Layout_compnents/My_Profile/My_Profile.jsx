import { useEffect, useState } from "react";
import axios from "axios";
import { FaMars, FaVenus, FaGenderless, FaEdit, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./My_Profile.css";
import defaultAvatar from "../../../Assets/defaukt.jpg";

export default function My_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/dashboard/editprofile");
  };

  const handleImageUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        "http://localhost:2666/user/editpicture",
        { profile_image: newImageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update image", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:2666/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const profileImg = profile.profile_image || defaultAvatar;

  const genderIcon =
    profile.gender === "M" ? (
      <FaMars color="#8e44ad" />
    ) : profile.gender === "F" ? (
      <FaVenus color="#c0392b" />
    ) : (
      <FaGenderless color="#6c757d" />
    );

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="my-profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-content">
        {/* Left Card */}
        <div className="profile-left-card">
          <div className="image-wrapper">
            <img src={profileImg} alt="Profile" className="profile-img" />
            <button
              className="edit-image-btn"
              onClick={() => setShowModal(true)}
            >
              <FaEdit />
            </button>
          </div>
          <h2>{profile.full_name}</h2>
          <p className="email">{profile.email}</p>
        </div>

        <div className="profile-right-card">
          <h3>General Information</h3>
          <div className="info-row">
            <p>
              <strong>Birth Date:</strong>{" "}
              {new Date(profile.birth_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="info-row">
            <p>
              <strong>Age:</strong> {calculateAge(profile.birth_date)} years
            </p>
          </div>
          <div className="info-row">
            <p>
              <strong>Gender:</strong> {genderIcon}
            </p>
          </div>
          <div className="info-row">
            <p>
              <strong>Phone:</strong> {profile.phone_number || "Not provided"}
            </p>
          </div>
          <div className="edit-btn-wrapper">
            <button className="edit-btn" onClick={handleEditClick}>
              Edit Profile Info
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            <h3>Update Profile Image</h3>
            <input
              type="text"
              placeholder="Enter image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button className="submit-btn" onClick={handleImageUpdate}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
