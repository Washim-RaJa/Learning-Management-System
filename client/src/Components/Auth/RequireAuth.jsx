import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state) => state?.auth);

  /*
    If Logged in & your role = permitted role --> Outlet will render RequireAuth's given children components/pages
    If Logged in & your role !== permitted role --> Navigate to Access denied page
    If neither Logged in nor your role !== permitted role --> Navigate to Log in page
  */ 
  
  return isLoggedIn && allowedRoles.find((myRole) => myRole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (<Navigate to={"/denied"} />) : (<Navigate to={"/login"} />);
};

export default RequireAuth;
  