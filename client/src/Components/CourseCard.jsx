import { useNavigate } from "react-router-dom"

const CourseCard = ({ data }) => {
    const navigate = useNavigate();


  return (
    // By Passing data prop into state we can provide the data to the navigated url i.e. "/course/description/"
    <div
        onClick={()=> navigate("/course/description/", {state: {...data}})}
        className="text-white w-72 lg:w-[22rem] sm:h-96 shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700">
        <div className="overflow-hidden">
            <img 
                className="sm:h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale=[1,2] transition-all ease-in-out duration-300"
                src={data?.thumbnail?.secure_url}
                alt="Course thumbnail"
            />
            <div className="p-3 space-y-1 text-white">
                <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
                    {data?.title}
                </h2>
                <p className="line-clamp-2 text-sm sm:text-base">
                    {data?.description}
                </p>
                <p className="">
                    <span className="text-yellow-500 font-bold">Category : </span>
                    <span className="text-sm sm:text-base whitespace-nowrap">
                        {data?.category}
                    </span>
                </p>
                <p className="font-semibold">
                    <span className="text-yellow-500 font-bold">Total lectures : </span>
                    {data?.numberOflectures}
                </p>
                <p className="font-semibold">
                    <span className="text-yellow-500 font-bold">Instructor : </span>
                    {data?.createdBy}
                </p>
            </div>
        </div>
    </div>
  )
}

export default CourseCard