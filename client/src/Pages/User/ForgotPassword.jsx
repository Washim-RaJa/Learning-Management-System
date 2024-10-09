import { useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isEmail } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout"
import { forgotPassword } from "../../Redux/Slices/AuthSlice";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ email, setEmail ] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email")
            return
        }
        if (!isEmail(email)) {
            toast.error("Invalid email id.");
            return;
        }
        const response = await dispatch(forgotPassword(email));
        if (response?.payload?.success) {
            navigate("/reset-password/:resetToken")
        }
        setEmail("")
    }
  return (
    <HomeLayout>
        <div className="h-[90.1vh] px-5 flex items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <div className="flex flex-col gap-5">
            <label htmlFor="new-password" className="text-center text-2xl font-semibold">
             Email
            </label>
            <input
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your registered email..."
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  )
}

export default ForgotPassword