import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaUsers, FaChartLine, FaCog } from "react-icons/fa";
import "./Main.css";

const features = [
  {
    icon: <FaUser />,
    title: "Your Profile",
    description: "Easily update your personal information and settings.",
  },
  {
    icon: <FaUsers />,
    title: "Team Management",
    description: "Organize and manage your teams efficiently.",
  },
  {
    icon: <FaChartLine />,
    title: "Reports",
    description: "Track your progress and team performance in detail.",
  },
  {
    icon: <FaCog />,
    title: "Settings",
    description: "Customize your experience to fit your needs.",
  },
];

export default function Main() {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:2666/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFullName(res.data.full_name);
      } catch (err) {
        console.error("Failed to fetch user name", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const firstName = fullName.split(" ")[0];

  return (
    <div className="dashboard-home">
      <h1 className="main-title">
        {loading ? "Welcome..." : `Welcome back, ${firstName} `}
      </h1>
      <p className="dashboard-subtitle">
        Here’s everything you need to manage your profile and team activities.
      </p>

      <div className="cards-container">
        {features.map(({ icon, title, description }, idx) => (
          <div key={idx} className="feature-card-main">
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
