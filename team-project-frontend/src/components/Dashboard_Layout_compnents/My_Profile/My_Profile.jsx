import { useEffect, useState } from "react";
import axios from "axios";
import "./My_Profile.css";
import defaultAvatar from "../../../Assets/defaukt.jpg";

export default function My_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:2666/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const profileImg = profile.image_url
    ? profile.image_url
    : defaultAvatar;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <img src={profileImg} alt="Profile" className="profile-img" />

        <h2>{profile.full_name}</h2>
        <p className="email">Email:{profile.email}</p>

        <div className="info-grid">
          <div>
            <span>Birth Date:</span>
            <p>{profile.birth_date}</p>
          </div>
          <div>
            <span>Gender:</span>
            <p>{profile.gender}</p>
          </div>
          <div>
            <span>Phone:</span>
            <p>{profile.phone_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
