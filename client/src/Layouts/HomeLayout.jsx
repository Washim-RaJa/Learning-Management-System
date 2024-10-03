import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
// import auth from "../Redux/Slices/AuthSlice";

const HomeLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Checking If user is logged in or not
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn); // if state & auth isn't null then returns isLoggedIn

  // For displaying the options according to role
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  }
  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;
    // changeWidth();
    // const drawerSide = document.getElementsByClassName("drawer-side");
    // drawerSide[0].style.width = 0;
  }
  async function handleLogout(e) {
    e.preventDefault();
    // const result = await dispatch(logout());
    // if(result?.payload?.success)
    navigate('/')
  }
  return (
    <div className="min-h-[90vh]">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className="font-bold text-white m-4"
            />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="h-full menu bg-base-200 text-base-content relative w-48 sm:w-80 p-4">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            <li className="text-white">
              <Link to={"/"}>Home</Link>
            </li>
            {isLoggedIn && role === "ADMIN" && (
              <li>
                <Link to={"/admin/dashboard"}>Admin Dashboard</Link>
              </li>
            )}
            <li>
              <Link to={"/courses"}>All Courses</Link>
            </li>
            <li>
              <Link to={"/contact"}>Contact Us</Link>
            </li>
            <li>
              <Link to={"/about"}>About Us</Link>
            </li>
            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex gap-2 items-center justify-center">
                  <button className="btn btn-primary font-semibold rounded-md w-1/2">
                    <Link to={"/login"}>Login</Link>
                  </button>
                  <button className="btn btn-secondary font-semibold rounded-md w-1/2">
                    <Link to={"/signup"}>Sign up</Link>
                  </button>
                </div>
              </li>
            )}
            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex gap-2 items-center justify-center">
                  <button className="btn btn-primary font-semibold rounded-md w-1/2">
                    <Link to={"/user/profile"}>Profile</Link>
                  </button>
                  <button className="btn btn-secondary font-semibold rounded-md w-1/2">
                    <Link onClick={handleLogout}>Log out</Link>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {children}

      <Footer />
    </div>
  );
};

export default HomeLayout;
