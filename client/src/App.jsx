import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Components/Auth/RequireAuth'
import AboutUs from './Pages/AboutUs'
import Contact from './Pages/Contact'
import CourseDescription from './Pages/Course/CourseDescription'
import CourseList from './Pages/Course/CourseList'
import CreateCourse from './Pages/Course/CreateCourse'
import AddLecture from './Pages/Dashboard/AddLecture'
import AdminDashboard from './Pages/Dashboard/AdminDashboard'
import DisplayLectures from './Pages/Dashboard/DisplayLectures'
import Denied from './Pages/Denied'
import HomePage from './Pages/HomePage'
import Login from './Pages/Login'
import NotFound from './Pages/NotFound'
import Checkout from './Pages/Payment/Checkout'
import CheckoutFailure from './Pages/Payment/CheckoutFailure'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess'
import Signup from './Pages/Signup'
import ChangePassword from './Pages/User/ChangePassword'
import EditProfile from './Pages/User/EditProfile'
import ForgotPassword from './Pages/User/ForgotPassword'
import Profile from './Pages/User/Profile'
import ResetForgotPassword from './Pages/User/ResetForgotPassword'

function App() {

  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/courses' element={<CourseList/>}/>
          <Route path='/course/description' element={<CourseDescription/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/forgotpassword' element={<ForgotPassword/>}/>
          <Route path='/reset-password/:resetToken' element={<ResetForgotPassword/>}/>

          <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]}/>} >
            <Route path='/user/profile' element={<Profile/>}/>
            <Route path='/user/editprofile' element={<EditProfile/>}/>
            <Route path='/changepassword' element={<ChangePassword/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/checkout/success' element={<CheckoutSuccess/>}/>
            <Route path='/checkout/fail' element={<CheckoutFailure/>}/>
            <Route path='/course/displaylecture' element={<DisplayLectures/>}/>
          </Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>} >
            <Route path='/course/create' element={<CreateCourse/>}/>
            <Route path='/course/addlecture' element={<AddLecture/>}/>
            <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          </Route>

          <Route path='/denied' element={<Denied/>}/>
          <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
