import React from "react";

const naverAIModules = [
  "HyperCLOVA X",
  "CLOVA Studio",
  "Papago",
  "CLOVA OCR",
  "CLOVA Speech",
  "CLOVA Voice",
  "CLOVA Vision",
  "CLOVA Face",
  "CLOVA Dubbing",
  "Naver Cloud AI",
];

const AICarousel = () => {
  return (
    <div className="w-full bg-white py-10 px-50">
      <div className="relative overflow-hidden">
        <div
          className="flex whitespace-nowrap gap-16"
          style={{
            animation: "marquee-rtl 15s linear infinite",
          }}
        >
          {/* First set */}
          {naverAIModules.map((name, index) => (
            <span
              key={`first-${index}`}
              className="text-gray-700 text-lg font-medium transition-colors cursor-default inline-block"
            >
              {name}
            </span>
          ))}
          {/* Duplicate set for seamless loop */}
          {naverAIModules.map((name, index) => (
            <span
              key={`second-${index}`}
              className="text-gray-700 text-lg font-medium transition-colors cursor-default inline-block"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Add keyframes inline for testing */}
      <style>{`
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default AICarousel;
