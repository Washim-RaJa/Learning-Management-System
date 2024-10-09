import { useState } from "react"
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { isValidPassword } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout"
import { resetPasswordToken } from "../../Redux/Slices/AuthSlice";

const ResetForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { resetToken } = useParams();
    const [ userInput, setUserInput ] = useState({
        newPassword: "",
        confirmNewPassword: "",
        resetToken
    })
    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }
    async function onSubmit(e) {
        e.preventDefault();
        if (!userInput.newPassword || !userInput.confirmNewPassword) {
            toast.error("All fields are mandatory")
            return
        }
        if (!isValidPassword(userInput.newPassword)) {
            toast.error("Password should be 8 to 16 characters long with at least a number & a special character")
            return
        }
        if (userInput.newPassword !== userInput.confirmNewPassword) {
            toast.error("New password didn't matched confirmed one");
            return
        }
        const response = dispatch(resetPasswordToken(userInput))
        console.log(response);
        
        setUserInput({
            newPassword: "",
            confirmNewPassword: "",
            resetToken
        })
        if (response?.success) {
            navigate("/login")
        }
    }
  return (
    <HomeLayout>
        <div className="h-[90.1vh] px-5 flex flex-col gap-y-7 items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="font-semibold">
             New Password
            </label>
            <input
              value={userInput.newPassword}
              onChange={handleUserInput}
              type="password"
              name="newPassword"
              id="newPassword"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your new password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmNewPassword" className="font-semibold">
                Confirm New Password
            </label>
            <input
              value={userInput.confirmNewPassword}
              onChange={handleUserInput}
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              className="bg-transparent px-2 py-1 border"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Submit
          </button>
        </form>
        <Link to={'/login'} className="link text-accent flex gap-x-3">
            <AiOutlineArrowLeft className="mt-1.5"/> Go to Log in
        </Link>
      </div>
    </HomeLayout>
  )
}

export default ResetForgotPassword