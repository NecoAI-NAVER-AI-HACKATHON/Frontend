import { Trophy, CircleCheckBig } from "lucide-react";

const SystemDemos = () => {
  const cards = [
    {
      label: "NAVER AI HACKATHON",
      title: "Smart feedback solving system",
      description:
        "The intelligent feedback processing system automatically collects and analyzes customer feedback using AI, identifies issues, suggests improvements, and sends appropriate emails—helping sellers optimize service quality and team performance.",
      img: "",
    },
    {
      label: "NAVER AI HACKATHON",
      title: "Create",
      description:
        "Use our drag-and-drop builder to design smart workflows combining Naver AI tools effortlessly.",
      img: "",
    },
    {
      label: "NAVER AI HACKATHON",
      title: "Target",
      description:
        "Automate personalized actions based on data, events, or user behavior in real time.",
      img: "",
    },
  ];
  return (
    <div className="flex flex-col bg-[#020C1C] justify-start py-20 px-20">
      {/* Header */}
      <div className="flex items-center justify-center text-center mb-10 gap-10 ">
        <Trophy className="text-white w-10 h-10" />
        <p className="text-[2rem] font-bold text-white">
          SOME AWESOME WORKFLOWS FROM NECOAI
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-rows-3 flex-wrap gap-30 px-10 mt-10">
        {/* First card */}
        <div className="flex items-center justify-center gap-10">
          {/* Text Under Image */}
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-3 px-3 py-3 border border-[#AFE6FF] rounded-full w-fit text-white">
              <CircleCheckBig />
              <p>NAVER AI HACKATHON</p>
            </div>
            <p className="text-[3rem] mt-4 font-bold text-white">
              Smart feedback solving system
            </p>
            <p className="text-sm mt-4 text-white">
              An AI-powered system that analyzes customer feedback, detects
              issues, suggests improvements, and sends smart emails to enhance
              service and team performance.
            </p>
          </div>

          <div className="flex flex-2 h-100 bg-[#DCE1FF] rounded-xl flex items-center justify-center border border-dashed border-gray-400">
            <img src="" />
          </div>
        </div>
        {/* Second card */}
        <div className="flex items-center justify-center gap-10">
          <div className="flex flex-2 h-100 bg-[#D5BDFF] rounded-xl flex items-center justify-center border border-dashed border-gray-400">
            <img src="" />
          </div>
          {/* Text Under Image */}
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-3 px-3 py-3 border border-[#D5BDFF] rounded-full w-fit text-white">
              <CircleCheckBig />
              <p>NAVER AI HACKATHON</p>
            </div>
            <p className="text-[3rem] mt-4 font-bold text-white">
              Smart feedback solving system
            </p>
            <p className="text-sm mt-4 text-white">
              An AI-powered system that analyzes customer feedback, detects
              issues, suggests improvements, and sends smart emails to enhance
              service and team performance.
            </p>
          </div>
        </div>
        {/* Third card */}
        <div className="flex items-center justify-center gap-10">
          {/* Text Under Image */}
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-3 px-3 py-3 border border-[#8398FF] rounded-full w-fit text-white">
              <CircleCheckBig />
              <p>NAVER AI HACKATHON</p>
            </div>
            <p className="text-[3rem] mt-4 font-bold text-white">
              Smart feedback solving system
            </p>
            <p className="text-sm mt-4 text-white">
              An AI-powered system that analyzes customer feedback, detects
              issues, suggests improvements, and sends smart emails to enhance
              service and team performance.
            </p>
          </div>

          <div className="flex flex-2 h-100 bg-[#8398FF] rounded-xl flex items-center justify-center border border-dashed border-gray-400">
            <img src="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDemos;
