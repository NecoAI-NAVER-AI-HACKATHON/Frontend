import { ChevronDown, ChevronUp } from "lucide-react";

const Banner = () => {
  return (
    <div className="flex items-center justify-center bg-[#5C45FF] gap-20 py-15 px-20">
      {/* Left: Info */}
      <div className="flex flex-col items-start">
        <p className="text-[#F0FC5B] font-bold mb-3">
          DISCOVER WHAT YOU CAN BUILD WITH NECOAI
        </p>
        <p className="text-white font-bold text-4xl mb-3">
          Create AI-driven workflows that transform how teams work and grow.
        </p>
      </div>

      {/* Right: FAQ list */}
      <div className="flex w-full md:w-2/3 justify-center">
        <div className="text-[#5C45FF] w-fit bg-white px-6 py-3 rounded-md font-medium">
          Contact us
        </div>
      </div>
    </div>
  );
};

export default Banner;
