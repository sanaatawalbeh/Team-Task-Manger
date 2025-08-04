import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Public_Layout from "./components/Public_Layout_components/Public_Layout/Public_Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import DashboardLayout from "./components/Dashboard_Layout_compnents/Dashboard_Layout/Dashboard_Layout";
import DashboardMain from "./components/Dashboard_Layout_compnents/Main_Page/Main";
import MyProfile from "./components/Dashboard_Layout_compnents/My_Profile/My_Profile";
import EditProfile from "./components/Dashboard_Layout_compnents/Edit_Profile/Edit_Profile";
import ChangePassword from "./components/Dashboard_Layout_compnents/Change_Password/Change_Password";
import CreateTeam from "./components/Dashboard_Layout_compnents/CreateTeam/CreateTeam";
import JoinTeam from "./components/Dashboard_Layout_compnents/JoinTeam/JoinTeam";
import MyTeams from "./components/Dashboard_Layout_compnents/MyTeams/MyTeams";
import MemberLayout from "./components/Member_Layout_comsponents/MemberLayout/MemberLayout";
import LeaderLayout from "./components/Leader_Layout_comsponents/LeaderLayout/LeaderLayout";
import TeamMembers from "./components/Mutal_components/TeamMembers/TeamMembers";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Public_Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="/dashboard/main" element={<DashboardMain />} />
            <Route path="/dashboard/profile" element={<MyProfile />} />
            <Route path="/dashboard/editprofile" element={<EditProfile />} />
            <Route
              path="/dashboard/changepassword"
              element={<ChangePassword />}
            />
            <Route path="/dashboard/createteam" element={<CreateTeam />} />
            <Route path="/dashboard/jointeam" element={<JoinTeam />} />
            <Route path="/dashboard/myteam" element={<MyTeams />} />
          </Route>

          <Route path="/leaderlayout" element={<LeaderLayout />}>
            <Route path="/leaderlayout/teammembers" element={<TeamMembers />} />
          </Route>

          <Route path="/memberlayout" element={<MemberLayout />}>
            <Route path="/memberlayout/teammembers" element={<TeamMembers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
