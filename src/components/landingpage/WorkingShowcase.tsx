const WorkingShowcase = () => {
  const cards = [
    {
      title: "Connect",
      description:
        "Quickly connect your data and Naver AI models like HyperCLOVA X, Papago, or CLOVA OCR — no setup hassle.",
      img: "",
    },
    {
      title: "Create",
      description:
        "Use our drag-and-drop builder to design smart workflows combining Naver AI tools effortlessly.",
      img: "",
    },
    {
      title: "Target",
      description:
        "Automate personalized actions based on data, events, or user behavior in real time.",
      img: "",
    },
    {
      title: "Measure",
      description:
        "Track model performance, view key metrics, and scale the workflows that deliver results.",
      img: "",
    },
  ];
  return (
    <div className="flex flex-col bg-[#DCE1FF] justify-start py-10 px-20">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-10">
        <p className="text-[5rem] font-bold text-transparent [-webkit-text-stroke:2px_#8691FF]">
          HOW NECOAI WORKS
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 flex-wrap gap-5 px-10">
        {cards.map((card, index) => (
          <div key={index} className="flex flex-col items-center rounded-2xl">
            {/* Placeholder Image Area */}
            <div className="w-full h-80 bg-[#DCE1FF] rounded-xl flex items-center justify-center border border-dashed border-gray-400">
              <img src={card.img} />
            </div>

            {/* Text Under Image */}
            <p className="text-xl mt-4 text-center font-bold text-gray-700">
              {card.title}
            </p>
            <p className="text-sm mt-4 text-center font-semibold text-gray-700">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingShowcase;
