import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  CircleQuestionMark,
  LogOut,
  BookOpen,
  ChartColumnBig,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/lib/services/authService";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await AuthService.logout();
      clearUser(); // Clear user profile from context
      setShowLogoutDialog(false);
      toast.success("Logged out successfully", {
        description: "You have been logged out",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state and redirect
      clearUser(); // Clear user profile from context
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      setShowLogoutDialog(false);
      toast.error("Logout failed", {
        description: "Redirecting to login page...",
      });
      navigate("/login");
    }
  };

  // There are buttons on the side bar, user can click on them to go to the corresponding page
  // --------------------------------------------------
  const mainPages = [
    {
      title: "Workspaces",
      icon: LayoutDashboard,
      link: "/workspaces",
    },
    {
      title: "Dashboards",
      icon: ChartColumnBig,
      link: "/dashboard",
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
              <div
                className="flex flex-items gap-2 items-center cursor-pointer text-[#627193]"
                onClick={() => {
                  if (page.title === "Logout") {
                    handleLogout();
                  } else {
                    navigate(page.link);
                  }
                }}
              >
                <page.icon className="h-4 w-auto" />
                <p className="text-sm">{page.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout?</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              variant="destructive"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SideBar;
