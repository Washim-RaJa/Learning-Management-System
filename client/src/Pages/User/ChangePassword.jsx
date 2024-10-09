import { useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

import { isValidPassword } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout"
import { changePassword, logout } from "../../Redux/Slices/AuthSlice";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [ userInput, setUserInput ] = useState({
        oldPassword: "",
        newPassword: ""
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
        if (!userInput.oldPassword || !userInput.newPassword ) {
            toast.error("All fields are mandatory!")
            return
        }
        if (!isValidPassword(userInput.newPassword)) {
            toast.error("Password should be 8 to 16 characters long with at least a number & a special character")
            return
        }
        const response = await dispatch(changePassword(userInput))
        console.log(response);
        
        if (response?.payload?.success) {
            await dispatch(logout())
            navigate('/login')
        }
        setUserInput({
            oldPassword: "",
            newPassword: ""
        })
    }
  return (
    <HomeLayout>
        <div className="h-[90.1vh] px-5 flex items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >

          <div className="flex flex-col gap-1">
            <label htmlFor="old-password" className="font-semibold">
              Old Password
            </label>
            <input
              value={userInput.oldPassword}
              onChange={handleUserInput}
              type="password"
              name="oldPassword"
              id="old-password"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your old password ..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="new-password" className="font-semibold">
              New Password
            </label>
            <input
              value={userInput.newPassword}
              onChange={handleUserInput}
              type="password"
              name="newPassword"
              id="new-password"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your new password ..."
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

export default ChangePassword