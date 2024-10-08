import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    previewImage: "",
    fullName: "",
    avatar: undefined,
    userId: useSelector((state) => state?.auth?.data?._id),
  });
  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }
  function handleUserInput(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }
  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.fullName && !data.avatar) {
      toast.error("Empty fields aren't allowed, choose at least one");
      return;
    }
    if (data.fullName && data.fullName.length < 3) {
        toast.error("Name can not be less than 3 characters");
        return;
    }
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("avatar", data.avatar);
    await dispatch(updateProfile( [ data.userId, formData ] ));
    // To get the new updated user data
    await dispatch(getUserData());
    navigate("/user/profile");
  }
  return (
    <HomeLayout>
      <div className="h-[100vh] pt-16 pb-5 px-5 flex items-center justify-center">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold">Edit profile</h1>
          <label htmlFor="image_uploads" className="cursor-pointer">
            {data.previewImage ? (
              <img
                className="w-28 h-28 rounded-full m-auto"
                src={data.previewImage}
                alt="profile_image"
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={handleImageUpload}
            type="file"
            name="image_uploads"
            id="image_uploads"
            className="hidden"
            accept=".jpg, .jpeg, .png, .svg, .webp"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Full Name
            </label>
            <input
              value={data.fullName}
              onChange={handleUserInput}
              type="text"
              name="fullName"
              id="fullName"
              className="bg-transparent px-2 py-1 border"
              placeholder="Enter your full name ..."
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Update profile
          </button>
          <Link to={'/user/profile'} >
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                <AiOutlineArrowLeft/>Go back to profile
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
};

export default EditProfile;
