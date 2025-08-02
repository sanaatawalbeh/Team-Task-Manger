import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Public_Layout from "./components/Public_Layout_components/Public_Layout/Public_Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import DashboardLayout from "./components/Dashboard_Layout_compnents/Dashboard_Layout/Dashboard_Layout";
import DashboardMain from "./components/Dashboard_Layout_compnents/Main_Page/Main";
import MyProfile from "./components/Dashboard_Layout_compnents/My_Profile/My_Profile"
import EditProfile from "./components/Dashboard_Layout_compnents/Edit_Profile/Edit_Profile";
import ChangePassword from "./components/Dashboard_Layout_compnents/Change_Password/Change_Password";
import CreateTeam from "./components/Dashboard_Layout_compnents/CreateTeam/CreateTeam"

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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>

    // <div>
    //   <BrowserRouter>
    //     <Public_Layout></Public_Layout>
    //   </BrowserRouter>
    // </div>
  );
}

export default App;
