import Showcase from "@/components/landingpage/Showcase";
import LandingTopbar from "@/components/topbar/LandingTopbar";
import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NaverAIShowcase from "@/components/landingpage/NaverAIShowcase";
import WorkingShowcase from "@/components/landingpage/WorkingShowcase";
import SystemDemos from "@/components/landingpage/SystemDemos";
import Questions from "@/components/landingpage/Questions";
import Banner from "@/components/landingpage/Banner";
import Footer from "@/components/landingpage/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* <div className="flex flex-col bg-[#CCEFFF] justify-start py-5 px-25"> */}
      <div className="flex flex-col bg-[radial-gradient(circle_at_40%_35%,rgba(150,120,255,0.35),transparent_25%),radial-gradient(circle_at_60%_65%,rgba(120,255,255,0.30),transparent_30%)] bg-white justify-start py-5 px-25">
        <LandingTopbar />
        <div className="flex flex-col mt-10 pb-10">
          {/* Header */}
          <div className="flex flex-col justify-center items-center text-center px-[120px]">
            <p className="text-[3rem] font-bold">
              Automate smarter with{" "}
              <a
                href="https://clova.ai/en/naver-ai-product"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#03C158]"
              >
                Naver AI
              </a>
            </p>
            <p className="text-[3rem] font-bold">
              Build, connect, and scale{" "}
              <span className="relative inline-block">
                effortlessly
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 400 20"
                  className="absolute left-0 bottom-[-6px] w-full h-5 text-blue-600"
                >
                  <path
                    d="M0,10 
         Q12.5,0 25,10 
         T50,10 T75,10 T100,10 
         T125,10 T150,10 T175,10 T200,10 
         T225,10 T250,10 T275,10 T300,10 
         T325,10 T350,10 T375,10 T400,10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                  >
                    <animate
                      attributeName="d"
                      dur="1.5s"
                      repeatCount="indefinite"
                      values="
          M0,10 
          Q12.5,0 25,10 T50,10 T75,10 T100,10 
          T125,10 T150,10 T175,10 T200,10 
          T225,10 T250,10 T275,10 T300,10 
          T325,10 T350,10 T375,10 T400,10;
          
          M0,10 
          Q12.5,20 25,10 T50,10 T75,10 T100,10 
          T125,10 T150,10 T175,10 T200,10 
          T225,10 T250,10 T275,10 T300,10 
          T325,10 T350,10 T375,10 T400,10;
          
          M0,10 
          Q12.5,0 25,10 T50,10 T75,10 T100,10 
          T125,10 T150,10 T175,10 T200,10 
          T225,10 T250,10 T275,10 T300,10 
          T325,10 T350,10 T375,10 T400,10
        "
                    />
                  </path>
                </svg>
              </span>
            </p>
          </div>

          {/* Subheader */}
          <div className="flex flex-col justify-center items-center text-center px-[200px] mt-5">
            <p className="text-lg font-medium">
              Build powerful automations using Naver AI, integrate tools
              seamlessly, optimize workflows,
            </p>
            <p className="text-lg font-medium">
              and empower teams to innovate faster every day
            </p>
          </div>

          {/* Navigate button */}
          <div className="flex items-center gap-5 justify-center mt-5">
            <div className="flex items-center text-[#5C46FC] font-medium">
              <p className="">Contact us</p>
            </div>

            <div
              className="bg-[#5C46FC] hover:bg-[#4534BF] transition-colors duration-200 ease-in-out text-white font-medium px-8 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </div>
          </div>

          {/* Showcases */}
          <div className="mt-20">
            <Showcase />
          </div>
        </div>
      </div>

      {/* Naver AI showcase */}
      <div className="flex flex-col gap-5 mt-10 mb-10">
        <div className="flex items-center gap-3 justify-center font-medium">
          <BadgeCheck className="w-4 h-4" />
          <p>
            Harnessing Naver’s growing AI ecosystem — models uniting language,
            vision, and data
          </p>
        </div>
        <NaverAIShowcase />

        {/* Defense and Offense */}
        <div className="flex items-end gap-10 px-40 mt-5">
          <img
            src="/defense_offense.png"
            alt="defense"
            className="w-200 h-auto"
          />
          <div className="pb-10">
            <p className="font-bold text-[2rem] leading-tight">
              Moving from manual, one-off fixes to repeatable, scalable
              automations.
            </p>
          </div>
        </div>
      </div>

      {/* How it works showcase */}
      <WorkingShowcase />

      {/* Some systems demo */}
      <SystemDemos />

      {/* Fluently asked question */}
      <Questions />

      {/* Banner */}
      <Banner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
