import {
  LayoutDashboard,
  Settings,
  CircleQuestionMark,
  LogOut,
  ChartColumnBig,
} from "lucide-react";

const SideBar = () => {
  const mainPages = [
    {
      title: "Workspaces",
      icon: LayoutDashboard,
      link: "/workspace",
    },
    {
      title: "Settings",
      icon: Settings,
      link: "/settings",
    },
  ];
  const subPages = [
    {
      title: "Dashboards",
      icon: ChartColumnBig,
      link: "/dashboards",
    },
    {
      title: "Help",
      icon: CircleQuestionMark,
      link: "/helps",
    },
    {
      title: "Logout",
      icon: LogOut,
      link: "/logout",
    },
  ];
  return (
    <div className="h-screen flex flex-col justify-between bg-white border-r border-r-gray-300 border-t-0 border-l-0 border-b-0">
      <div className="flex flex-col gap-3">
        {/* Logo */}
        <div className="flex p-4 justify-center">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
        </div>

        {/* Main pages */}
        <div>
          {mainPages.map((page, index) => (
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
