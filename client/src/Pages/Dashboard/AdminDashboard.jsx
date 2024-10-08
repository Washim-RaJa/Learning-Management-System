import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";
import { Bar, Pie } from 'react-chartjs-2'
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from 'react-icons/fa'
import { FcSalesPerformance } from 'react-icons/fc'
import { GiMoneyStack } from 'react-icons/gi'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount, subscribedCount } = useSelector( state => state.stat );
    const { allPayments, monthlySalesRecord } = useSelector( state => state.razorpay );

    const userData = {
        labels: ["Registered User", "Enrolled User", "Others"],
        fontColor: "white",
        datasets: [
            {
                label: "User Details",
                data: [ allUsersCount, subscribedCount, 1 ],
                backgroundColor: [ "yellow", "green", "gray" ],
                borderWidth: 1,
                borderColor: [ "yellow", "green" ]
            }
        ]
    }
    const salesData = {
        labels: [ "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        fontColor: "white",
        datasets: [
            {
                label: "Sales / Month",
                data: monthlySalesRecord,
                backgroundColor: ["red"],
                borderColor: ["white"],
                borderWidth: 2
            }
        ]
    }
    
    const myCourses = useSelector( state => state?.course?.courseData);

    async function onCourseDelete(id) {
        if (window.confirm("Are you sure, you want to delete the course ?")) {
            const res = await dispatch(deleteCourse(id))
            if (res?.payload?.success) {
                await dispatch(getAllCourses())
            }
        }
    }

    useEffect(()=> {
        (
            async () => {
                await dispatch(getAllCourses());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord());

            }
        )()
    }, [])

  return (
    <HomeLayout>
        <div className="min-h-[91vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
            <h1 className="text-center text-5xl font-semibold text-yellow-500">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-2 gap-5 m-auto mx-10">
                <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                    <div className="w-80 h-80">
                        <Pie data={userData}/>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                                <p className="font-semibold">Registered User</p>
                                <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                            </div>
                            <FaUsers className="text-yellow-500 text-5xl"/>
                        </div>
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                                <p className="font-semibold">Subscribed User</p>
                                <h3 className="text-4xl font-bold">{subscribedCount}</h3>
                            </div>
                            <FaUsers className="text-green-500 text-5xl"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                    <div className="h-80 w-full relative">
                        <Bar className="absolute bottom-0 h-80 w-full" data={salesData}/>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                                <p className="font-semibold">Subscription Count</p>
                                <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
                            </div>
                            <FcSalesPerformance className="text-yellow-500 text-5xl"/>
                        </div>
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                                <p className="font-semibold">Total Revenue</p>
                                <h3 className="text-4xl font-bold">{ allPayments?.count * 499 }</h3>
                            </div>
                            <GiMoneyStack className="text-green-500 text-5xl"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-center text-3xl font-semibold">
                        Courses overview
                    </h1>
                    <button
                        onClick={() => navigate('/course/create')} 
                        className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-lg"
                    >
                        Create new cousre
                    </button>
                </div>
                <table className="table overflow-x-scroll">
                    <thead>
                        <tr>
                            <th className="text-center">S no</th>
                            <th className="text-center">Course Title</th>
                            <th className="text-center">Course Category</th>
                            <th className="text-center">Instrutor</th>
                            <th className="text-center">Total Lectures</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCourses?.map((course, idx) => (
                            <tr key={course?._id}>
                                <td className="text-center">{idx+1}</td>
                                <td>
                                    <textarea readOnly value={course?.title} className="text-center w-full flex items-center justify-center h-auto bg-transparent resize-none">

                                    </textarea>
                                </td>
                                <td className="text-center">
                                    {course?.category}
                                </td>
                                <td className="text-center">
                                    {course?.createdBy}
                                </td>
                                <td className="text-center">
                                    {course?.numberOfLectures}
                                </td>
                                <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    <textarea
                                        value={course?.description}
                                        readOnly
                                        className="text-center h-full w-full bg-transparent resize-none"
                                    >

                                    </textarea>
                                </td>
                                <td className="flex justify-center items-center gap-4">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                                        onClick={()=> navigate('/course/displaylecture', {state : {...course}})}
                                    >
                                        <BsCollectionPlayFill/>
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                                        onClick={()=> onCourseDelete(course?._id)}
                                    >
                                        <BsTrash/>
                                    </button>
                                </td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>
        </div>
    </HomeLayout>
);
};

export default AdminDashboard;
