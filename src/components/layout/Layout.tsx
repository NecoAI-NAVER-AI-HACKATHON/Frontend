// Layout.tsx
import SideBar from "../sidebar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-full h-screen flex">
      <SideBar />
      <main className="flex-1 h-screen flex flex-col">
        <div className="bg-[#F5F7FA] overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
