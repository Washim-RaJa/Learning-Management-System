import { Link } from "react-router-dom"

import homePageMainImage from '../Assets/Images/homePageMainImage.png'
import HomeLayout from "../Layouts/HomeLayout"
const HomePage = () => {
  return (
    <HomeLayout>
        <div className="min-h-[90.1vh] mx-16 pt-20 lg:pt-10 text-white grid grid-col-1 lg:grid-cols-2 items-center justify-center gap-5">
            <div className="space-y-6">
                <h1 className="text-center lg:text-left text-3xl sm:text-5xl font-semibold">
                    Find out best
                    <span className="text-yellow-500 font-bold"> Online Courses</span>     
                </h1>
                <p className="text-center lg:text-left text-sm sm:text-xl text-gray-200">
                    We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
                </p>
                <div className="flex flex-wrap gap-6 justify-center items-center lg:justify-start">
                    <Link to={'/courses'}>
                        <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                            Explore Courses
                        </button>
                    </Link>
                    <Link to={'/contact'}>
                        <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                            Contact Us
                        </button>
                    </Link>
                </div>
            </div>
            <div className=" flex items-center justify-center">
                <img src={homePageMainImage} alt="Homepage image" />
            </div>
        </div>
    </HomeLayout>
  )
}

export default HomePage