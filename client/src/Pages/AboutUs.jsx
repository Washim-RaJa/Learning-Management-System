import aboutMainImage from "../Assets/Images/aboutMainImage.png";
import CarouselSlide from "../Components/CarouselSlide";
import { celebrities } from "../Constants/CelebrityData";
import HomeLayout from "../Layouts/HomeLayout";


const AboutUs = () => {

  return (
    <HomeLayout>
      <div className="px-10 lg:px-20 pt-20 flex flex-col text-white">
        <div className="grid lg:grid-cols-2 items-center gap-5 mx-10">
          <section className="space-y-10">
            <h1 className="text-center lg:text-left text-3xl sm:text-5xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-center lg:text-left text-sm sm:text-xl text-gray-200">
              Our goal is to provide the affordable and quality education. We
              are providing the platform for the aspiring teachers and students
              to share their skills, creativity and knowledge to each other to
              empower and contribute in the grwoth and wellness of mankind.
            </p>
          </section>
          <div className="">
            <img
              style={{ filter: "drop-shadow(0px 10px 10px rgb(0,0,0))" }}
              id="test1"
              className="drop-shadow-2xl mx-auto"
              src={aboutMainImage}
              alt="aboutMainImage"
            />
          </div>
        </div>
        <div className="carousel w-full lg:w-1/2 my-16 m-auto">
        { celebrities && celebrities.map(celebrity => (
            <CarouselSlide key={celebrity.slideNumber} {...celebrity} totalSlides={celebrities.length}/>
        ))}
        </div>
      </div>
    </HomeLayout>
  );
};

export default AboutUs;
