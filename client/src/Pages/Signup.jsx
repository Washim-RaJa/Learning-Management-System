import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/AuthSlice";

const Signup = () => {
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });
  function handleUserInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }
  function getImage(e) {
    e.preventDefault();
    // uploadedImage is an object containing name, size, type, lastModified of the uploaded file
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedImage);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  }
  async function createNewAccount(e) {
    e.preventDefault();
    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }
    if (signupData.fullName.length < 3) {
      toast.error("Name should be at least of 3 characters.");
      return;
    }
    if (
        !signupData.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Invalid email id.");
      return;
    }
    // you should have 6 to 16 valid characters | has at least one number | has at least one special character
    if (!signupData.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)) {
      toast.error("Password should be 8 to 16 characters long with at least a number & a special character");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", signupData.fullName)
    formData.append("email", signupData.email)
    formData.append("password", signupData.password)
    formData.append("avatar", signupData.avatar)
    const response = await dispatch(createAccount(formData));
        
    if (response?.payload?.success) {
        navigate("/");
    }
    setSignupData({
        fullName: "",
        email: "",
        password: "",
        avatar: "",
    });
    setPreviewImage("")
  }

  return (
    <HomeLayout>
      <div className="h-[90.1vh] flex items-center justify-center">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>
          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img
                src={previewImage}
                alt="profile_image"
                className="w-24 h-24 rounded-full m-auto"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={getImage}
            type="file"
            name="image_uploads"
            id="image_uploads"
            className="hidden"
            accept=".jpg, .jpeg, .png, .svg, .webp"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              value={signupData.fullName}
              onChange={handleUserInput}
              required
              type="text"
              name="fullName"
              id="fullName"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your full name ..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              value={signupData.email}
              onChange={handleUserInput}
              required
              type="email"
              name="email"
              id="email"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your email ..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              value={signupData.password}
              onChange={handleUserInput}
              required
              type="password"
              name="password"
              id="password"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your password ..."
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Create account
          </button>
          <p className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="link text-accent">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Signup;
