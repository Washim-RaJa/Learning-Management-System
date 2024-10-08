import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";

const AddLecture = () => {
  const courseDetails = useLocation().state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(courseDetails);
  
  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
  });
  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }
  function handleVideo(e) {
    const video = e.target.files[0];
    const source = window.URL.createObjectURL(video);
    console.log(source);
    setUserInput({
      ...userInput,
      lecture: video,
      videoSrc: source,
    });
  }
  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.title || !userInput.description || !userInput.lecture) {
      toast.error("All fields are mandatory");
      return;
    }
    const response = await dispatch(addCourseLectures(userInput));
    if (response?.payload?.success) {
        navigate(-1)
      setUserInput({
        id: courseDetails._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
      });
    }
  }

  useEffect(() => {
    if (!courseDetails) navigate("/courses");
  }, []);
  return (
    <HomeLayout>
      <div className="min-h-[92vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 text-xl text-green-500"
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">
              Add new lecture
            </h1>
          </header>
          <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Enter the title of the lecture"
              className="bg-transparent px-3 py-1 border"
              value={userInput.title}
              onChange={handleUserInput}
            />
            <textarea
              type="text"
              name="description"
              placeholder="Enter the description of the lecture"
              className="bg-transparent px-3 py-1 border resize-none h-36 overflow-y-scroll"
              value={userInput.description}
              onChange={handleUserInput}
            />
            {userInput.videoSrc ? (
              <video
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                src={userInput.videoSrc}
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload nofullscreen"
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label className="font-semibold text-xl cursor-pointer" htmlFor="lecture">Choose your video</label>
                <input
                  type="file"
                  name="lecture"
                  id="lecture"
                  className="hidden"
                  onChange={handleVideo}
                  accept="video/mp4, video/x-mp4, video/*"
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary py-1 font-semibold text-lg text-white">
                Add new lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AddLecture;
