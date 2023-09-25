import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
