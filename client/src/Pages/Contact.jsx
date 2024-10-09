import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axiosInstance.js";
import { isEmail } from "../Helpers/regexMatcher.js";
import HomeLayout from "../Layouts/HomeLayout";

const Contact = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }
  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.name || !userInput.email || !userInput.message) {
      toast.error("All fields are mandatory!");
      return;
    }
    if (!isEmail(userInput.email)) {
      toast.error("Invalid email id.");
      return;
    }
    try {
        const response = axiosInstance.post("/contact", userInput);
        toast.promise(response, {
            loading: "Submitting your message..",
            success: "Form submitted successfully",
            error: "Failed to submit form"
        })

        const contactResponse = await response;
        if ( contactResponse?.data?.success) {
            setUserInput({
                name: "",
                email: "",
                message: "",
            })
        }
    } catch (error) {
        toast.error(error.message || "Operation failed!")
    }
  }
  return (
    <HomeLayout>
      <div className="flex items-center justify-center pt-20 pb-10 px-5 min-h-[100vh]">
        <form
          noValidate
          onSubmit={onFormSubmit}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[22rem]"
        >
          <h1 className="text-3xl font-semibold">Contact Form</h1>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="name" className="text-xl font-semibold">
              Name
            </label>
            <input
              className="bg-transparent border px-2 py-1 rounded-sm"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={userInput.name}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="email" className="text-xl font-semibold">
              Email
            </label>
            <input
              className="bg-transparent border px-2 py-1 rounded-sm"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={userInput.email}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="message" className="text-xl font-semibold">
              Message
            </label>
            <textarea
              className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40"
              id="message"
              name="message"
              placeholder="Enter your message"
              onChange={handleInputChange}
              value={userInput.message}
            ></textarea>
          </div>
          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg mt-2"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Contact;
