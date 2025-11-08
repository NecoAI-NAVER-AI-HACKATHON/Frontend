import { FolderOpen } from "lucide-react";
import Systems from "../../components/workspace_systems/Systems";
import Models from "../../components/workspace_models/Models";
import Logs from "../../components/workspace_logs/Logs";
import Chatbot from "../../components/workspace_chatbot/Chatbot";
import { WorkspacesData } from "../../mockdata/WorkspacesData";
import TopBar from "../../components/topbar/TopBar";
import { useParams } from "react-router-dom";
import { useState } from "react";

const WorkspaceDetail = () => {
  const { id } = useParams();

  const workspace_id = id;
  console.log(workspace_id);

  const workspace_data = WorkspacesData[0];

  const [clickedOption, setClickedOption] = useState<string>("Systems");

  const options = [
    {
      title: "Systems",
    },
    {
      title: "Models",
    },
    {
      title: "Logs",
    },
    {
      title: "Chatbot",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <TopBar />
      <hr className="border-gray-300" />

      {/* Workspace */}
      <div className="flex-1 flex flex-col bg-white px-10 overflow-y-auto">
        {/* Headers */}
        <div className="flex flex-col mt-5">
          <div className="flex items-center gap-2">
            <FolderOpen />
            <p className="text-xl font-medium">{workspace_data.name}</p>
          </div>
          <p className="font-medium text-[#627193]">
            {workspace_data.description}
          </p>
        </div>

        {/* Options bar */}
        <div className="flex flex-item items-center mt-5 border border-gray-300 w-fit rounded-lg p-1">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center px-2 py-1 cursor-pointer ${
                clickedOption === option.title
                  ? "bg-[#EDEDED] text-[#5757F5] rounded-md font-medium"
                  : "text-[#627193]"
              }`}
              onClick={() => setClickedOption(option.title)}
            >
              <p className="text-sm">{option.title}</p>
            </div>
          ))}
        </div>

        {clickedOption === "Systems" && <Systems />}
        {clickedOption === "Models" && <Models />}
        {clickedOption === "Logs" && <Logs />}
        {clickedOption === "Chatbot" && <Chatbot />}
      </div>
    </div>
  );
};

export default WorkspaceDetail;
