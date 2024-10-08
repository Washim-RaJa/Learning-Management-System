import { BsFacebook, BsInstagram, BsLinkedin,BsTwitter } from 'react-icons/bs';

const Footer = () => {
  return (
    <>
        <footer className='relative left-0 bottom-0 sm:h-[10vh] gap-y-5 py-5 sm:px-20 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800'>
            <section className='text-sm sm:text-lg'>
                Copyright {new Date().getFullYear()} | All rights reserved
            </section>
            <section className='flex items-center justify-center gap-5 sm:text-2xl text-white'>
                <a href="#" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                    <BsFacebook/>
                </a>
                <a href="#" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                    <BsInstagram/>
                </a>
                <a href="#" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                    <BsLinkedin/>
                </a>
                <a href="#" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                    <BsTwitter/>
                </a>
            </section>
        </footer>
    </>
  )
}

export default Footer