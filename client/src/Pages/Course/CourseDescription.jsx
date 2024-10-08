import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

const CourseDescription = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { role, data } = useSelector((state) => state?.auth);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-5 sm:px-20 flex flex-col items-center justify-center text-white">
        <div className="grid lg:grid-cols-2 gap-7 lg:gap-20 py-10 relative">
          <div className="space-y-5 order-2 lg:order-1">
            <img
              className="w-full sm:h-64"
              src={state?.thumbnail?.secure_url}
              alt="Course_Thumbnail"
            />

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-between text-xl">
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Total lectures :{" "}
                  </span>
                  {state?.numberOfLectures}
                </p>
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Instructor :{" "}
                  </span>
                  {state?.createdBy}
                </p>
              </div>
              {role === "ADMIN" || data?.subscription?.status === "active" ? (
                <button
                  onClick={()=> navigate('/course/displaylecture', { state: { ...state }})}
                  className="bg-yellow-600 hover:bg-yellow-500 text-xl rounded-md font-bold px-5 py-3 w-full transition-all ease-in-out duration-300">
                  Watch lectures
                </button>
              ) : (
                <button 
                  onClick={()=> navigate("/checkout")}
                  className="bg-yellow-600 hover:bg-yellow-500 text-xl rounded-md font-bold px-5 py-3 w-full transition-all ease-in-out duration-300">
                  Subscribe
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2 text-xl order-1 lg:order-2">
            <h1 className="text-center lg:text-left text-3xl font-bold text-yellow-500 mb-5 ">
                {state?.title}
            </h1>
            <p className="text-yellow-500 text-center lg:text-left">Course description</p>
            <p className="text-center lg:text-left">{state?.description}</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default CourseDescription;
