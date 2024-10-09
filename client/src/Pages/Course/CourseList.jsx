import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import CourseCard from "../../Components/CourseCard"
import HomeLayout from "../../Layouts/HomeLayout"
import { getAllCourses } from "../../Redux/Slices/CourseSlice"

const CourseList = () => {
    const dispatch = useDispatch()
    const { courseData } = useSelector(state => state?.course)  // course is the key name of courseSliceReducer in store.js

    async function loadCourses () {
        await dispatch(getAllCourses());
    }

    useEffect(()=>{
        loadCourses();
    }, [])
    
  return (
    <HomeLayout>
        <div className="min-h-[90vh] pt-12 px-14 flex flex-col gap-10 text-white">
            <h1 className="text-center text-xl lg:text-3xl font-semibold mb-5">
                Explore the courses made by
                <span className="font-bold text-yellow-500"> Industry experts</span>
            </h1>
            <div className="mb-10 flex flex-wrap justify-center gap-5 lg:gap-14">
                {courseData?.map((element)=> (
                    <CourseCard key={element._id} data={element}/>
                ))}
            </div>
        </div>
    </HomeLayout>
  )
}

export default CourseList