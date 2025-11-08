import { CircleHelp, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // There are buttons on the top bar, user can click on them to go to the corresponding page
  // --- TopBar Button Component ---
  const TopBarButton = ({
    title_button,
    path,
  }: {
    title_button: string;
    path: string;
  }) => (
    <div
      className="flex items-center cursor-pointer transition"
      onClick={() => navigate(path)}
    >
      <p className="font-medium text-[#627193]">{title_button}</p>
    </div>
  );

  const renderHeaderContent = () => {
    // Create a map of header content based on the URL path
    if (location.pathname === "/workspaces") {
      return <TopBarButton title_button="Workspaces" path="/workspaces" />;
    }

    // /workspaces/:id
    if (location.pathname.startsWith("/workspaces/")) {
      return (
        <div className="flex items-center gap-2">
          <TopBarButton title_button="Workspaces" path="/workspaces" />
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <TopBarButton title_button="Systems" path="/workspaces" />
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-between h-15 bg-white px-10">
      {/* Render header content */}
      {renderHeaderContent()}

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="text-xs bg-white rounded-full text-[#627193] px-3 py-2 cursor-pointer hover:bg-[#EDEDED]">
          <p>Feedback</p>
        </div>
        <div className="bg-white border rounded-full border-gray-300 text-[#627193] p-2 cursor-pointer">
          <CircleHelp className="w-4 h-4" />
        </div>
        <div className="bg-white border rounded-full border-gray-300 text-[#627193] cursor-pointer">
          <img src="default-avt.svg" alt="user" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
