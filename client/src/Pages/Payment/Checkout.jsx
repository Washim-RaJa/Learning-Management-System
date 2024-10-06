import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

import HomeLayout from "../../Layouts/HomeLayout";
import { getRazorpayId, purchaseCourseBundle } from "../../Redux/Slices/RazorpaySlice";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const razorpayKey = useSelector( state => state?.razorpay?.key);
    const subscription_id = useSelector( state => state?.razorpay?.subscription_id);
    const isPaymentVerified = useSelector( state => state?.razorpay?.isPaymentVerified);
    const userData = useSelector( state => state?.auth?.data);

    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    }
    async function handleSubscription(e) {
        e.preventDefault();
        if (!razorpayKey || !subscription_id) {
            toast.error("Something went wrong")
            return
        }
    }
    async function load() {
        await dispatch(getRazorpayId())
        await dispatch(purchaseCourseBundle())
    }
    useEffect(()=> {
        // load()
    }, [])
  return (
    <HomeLayout>
        <div className="h-[100vh] flex items-center justify-center">Checkout</div>
    </HomeLayout>
  )
}

export default Checkout