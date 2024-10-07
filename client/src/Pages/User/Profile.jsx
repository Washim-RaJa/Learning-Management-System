import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const userData = useSelector(state=> state?.auth?.data);
    
    async function handleCancellation() {
      toast.loading("Initiating cancellation")
      await dispatch(cancelCourseBundle());
      await dispatch(getUserData());
      toast.success("Cancellation completed!")
      navigate('/')
    }
  return (
    <HomeLayout>
      <div className="min-h-[91vh] flex items-center justify-center">
        <div className="my-10 flex flex-col gap-4 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
          <img
            className="w-40 m-auto rounded-full border border-black"
            src={userData?.avatar?.secure_url}
            alt="Profile_picture"
          />
          <h3 className="text-xl font-semibold text-center capitalize">
                {userData?.fullName}
          </h3>
          <div className="grid grid-cols-2">
            <p>Email: </p><p>{userData?.email}</p>
            <p>Role: </p><p>{userData?.role}</p>
            <p>Subscription: </p><p>{userData?.subscription?.status === "active" ? "Active" : "Inactive"}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
             <Link
                to={userData?.email === "test@gmail.com" ? "/denied" : "/changepassword"}
                className="w-1/2 bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center"
             >
                <button>Change Password</button>
             </Link>

             <Link
                to={userData?.email === "test@gmail.com" ? "/denied" : "/user/editprofile"}
                className="w-1/2 bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center"
             >
                <button>Edit Profile</button>
             </Link>
          </div>
          {userData?.subscription?.status === "active" && (
            <button onClick={handleCancellation} className="w-full bg-red-600 hover:bg-red-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center">
                Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Profile;
