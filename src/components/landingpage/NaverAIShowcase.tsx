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
    <div className="relative overflow-hidden py-5 w-full">
      <div className="flex animate-marquee gap-16 w-max">
        {[...naverAIModules, ...naverAIModules].map((name, index) => (
          <span
            key={index}
            className="text-gray-700 text-lg font-medium hover:text-[#5C46FC] transition-colors whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AICarousel;
