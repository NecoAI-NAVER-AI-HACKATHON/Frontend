import {
  LayoutDashboard,
  Settings,
  CircleQuestionMark,
  LogOut,
  BookOpen,
  ChartColumnBig,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // There are buttons on the side bar, user can click on them to go to the corresponding page
  // --------------------------------------------------
  const mainPages = [
    {
      title: "Workspaces",
      icon: LayoutDashboard,
      link: "/workspace",
    },
    {
      title: "Dashboards",
      icon: ChartColumnBig,
      link: "/dashboards",
    },
    {
      title: "Settings",
      icon: Settings,
      link: "/settings",
    },
  ];
  const subPages = [
    {
      title: "Help",
      icon: CircleQuestionMark,
      link: "/helps",
    },
    {
      title: "Documents",
      icon: BookOpen,
      link: "/documents",
    },
    {
      title: "Logout",
      icon: LogOut,
      link: "/logout",
    },
  ];
  // --------------------------------------------------

  return (
    <div className="h-screen flex flex-col justify-between bg-white border-r border-r-gray-300 border-t-0 border-l-0 border-b-0">
      <div className="flex flex-col gap-3">
        {/* Logo */}
        <div className="flex p-4 justify-center">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
        </div>

        {/* Main pages */}
        <div>
          {mainPages.map((page, index) => {
            const isActive = location.pathname.startsWith(page.link);
            const Icon = page.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(page.link)}
                className={`px-8 py-2 cursor-pointer transition duration-200 flex items-center gap-2
                  ${
                    isActive
                      ? "rounded-md bg-[#EDEDED] font-medium text-[#5757F5]"
                      : "text-[#627193] hover:bg-[#EDEDED] hover:font-medium"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <p className="text-sm">{page.title}</p>
              </div>
            );
          })}
        </div>

        <hr className="border-gray-300" />
      </div>

      <div className="flex flex-col gap-3">
        <hr className="border-gray-300" />
        {/* Sub pages */}
        <div>
          {subPages.map((page, index) => (
            <div
              key={index}
              className="px-8 py-2 hover:bg-[#EDEDED] hover:font-medium"
            >
              <div className="flex flex-items gap-2 items-center cursor-pointer text-[#627193]">
                <page.icon className="h-4 w-auto" />
                <p className="text-sm">{page.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SideBar;
