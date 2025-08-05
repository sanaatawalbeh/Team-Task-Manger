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
import AddMember from "./components/Leader_Layout_comsponents/AddMember/AddMember";
import RemoveMember from "./components/Leader_Layout_comsponents/RemoveMember/RemoveMember";
import ChangeRole from "./components/Leader_Layout_comsponents/ChangeRole/ChangeRole";
import LeaveTeam from "./components/Mutal_components/LeaveTeam/LeaveTeam";
import CreateTask from "./components/Mutal_components/CreateTask/CreateTask";
import AllTeamTasks from "./components/Mutal_components/AllTeamTasks/AllTeamTasks";
import MyTasks from "./components/Mutal_components/MyTasks/MyTasks";

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
            <Route path="/leaderlayout/addmember" element={<AddMember />} />
            <Route
              path="/leaderlayout/removemember"
              element={<RemoveMember />}
            />
            <Route path="/leaderlayout/changerole" element={<ChangeRole />} />
            <Route path="/leaderlayout/leaveteam" element={<LeaveTeam />} />
            <Route path="/leaderlayout/createtask" element={<CreateTask />} />
            <Route
              path="/leaderlayout/allteamtasks"
              element={<AllTeamTasks />}
            />
            <Route path="/leaderlayout/mytasks" element={<MyTasks />} />
          </Route>

          <Route path="/memberlayout" element={<MemberLayout />}>
            <Route path="/memberlayout/teammembers" element={<TeamMembers />} />
            <Route path="/memberlayout/leaveteam" element={<LeaveTeam />} />
            <Route path="/memberlayout/createtask" element={<CreateTask />} />
            <Route
              path="/memberlayout/allteamtasks"
              element={<AllTeamTasks />}
            />
            <Route path="/memberlayout/mytasks" element={<MyTasks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
