import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Questions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      title: "What is NecoAI?",
      answer:
        "NecoAI is a workflow automation platform powered by Naver AI, helping teams connect, create, and optimize intelligent workflows.",
    },
    {
      title: "How does it integrate with Naver AI?",
      answer:
        "You can directly use Naver AI services like HyperCLOVA X, Papago, CLOVA OCR, and CLOVA Studio through built-in connectors.",
    },
    {
      title: "Do I need coding skills?",
      answer:
        "No, NecoAI offers a low-code, drag-and-drop builder so anyone can create powerful AI workflows easily.",
    },
    {
      title: "Can I monitor workflow performance?",
      answer:
        "Yes, you can view metrics like response time, success rate, and cost analytics for every workflow you create.",
    },
    {
      title: "What data sources can I connect?",
      answer:
        "You can connect databases, APIs, or directly integrate Naver AI data pipelines with just a few clicks.",
    },
    {
      title: "Can I customize workflows for different teams?",
      answer:
        "Absolutely. Each team can design and manage its own workflows with access control and shared templates.",
    },
    {
      title: "How do I get started?",
      answer:
        "Simply sign up, connect your Naver Cloud account, and start building workflows from our visual builder.",
    },
    {
      title: "Does it support multilingual tasks?",
      answer:
        "Yes. With Papago and HyperCLOVA X, you can automate translation, summarization, and communication in multiple languages.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center bg-white gap-10 py-16 px-10 md:px-20">
      {/* Left: Info */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
        <p className="font-bold text-3xl mb-3">Frequently Asked Questions</p>
        <img
          src="/cool_boy.png"
          alt="Frequently asked questions"
          className="w-full mb-3"
        />
      </div>

      {/* Right: FAQ list */}
      <div className="flex flex-col w-full md:w-2/3">
        {questions.map((q, index) => (
          <div
            key={index}
            className="border-b-2 border-gray-300 p-5 cursor-pointer"
            onClick={() => toggleQuestion(index)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg text-gray-800">{q.title}</p>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {q.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
