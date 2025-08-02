import Navbar from "../../Public_Layout_components/Navbar/Navbar";
import Footer from "../../Public_Layout_components/Footer/Footer";
import "./Public_Layout.css"
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <>
      <div className="layout-wrapper">
        <Navbar />
        <Outlet /> 
        <Footer />
      </div>
    </>
  );
}
