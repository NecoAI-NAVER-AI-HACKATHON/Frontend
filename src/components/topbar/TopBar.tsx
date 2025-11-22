import { ChevronRight, CircleHelp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // Lấy đường dẫn hiện tại và chia thành các phần
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  // Hàm chuyển đến path khi click breadcrumb
  const handleNavigate = (index: number) => {
    const targetPath = "/" + pathSegments.slice(0, index + 1).join("/");
    navigate(targetPath);
  };

  return (
    <div className="flex items-center justify-between h-16 bg-white px-10">
      {/* Breadcrumb Section */}
      <div className="flex items-center gap-2 text-[#627193]">
        {pathSegments.length === 0 ? (
          <p className="font-semibold text-[#627193]">Home</p>
        ) : (
          pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const title =
              segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " ");
            return (
              <div key={index} className="flex items-center gap-2">
                <p
                  className={`cursor-pointer font-medium ${
                    isLast
                      ? "text-[#5C46FC]"
                      : "text-[#627193] hover:text-[#5C46FC]"
                  }`}
                  onClick={() => !isLast && handleNavigate(index)}
                >
                  {title}
                </p>
                {!isLast && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            );
          })
        )}
      </div>

      {/* Right Section: User tools */}
      <div className="flex items-center gap-3">
        <div className="text-xs bg-white rounded-full text-[#627193] px-3 py-2 cursor-pointer hover:bg-[#EDEDED]">
          Feedback
        </div>
        <div className="bg-white border rounded-full border-gray-300 text-[#627193] p-2 cursor-pointer hover:bg-[#EDEDED]">
          <CircleHelp className="w-4 h-4" />
        </div>
        <div
          className="bg-white border rounded-full border-gray-300 cursor-pointer hover:bg-[#EDEDED] flex items-center gap-2 px-2 py-1"
          onClick={() => navigate("/settings")}
          title={user?.email || "User"}
        >
          <img
            src="/default-avt.svg"
            alt={user?.email || "user"}
            className="w-8 h-8 rounded-full"
          />
          {!loading && user && (
            <div className="flex flex-col items-start mr-2">
              <span className="text-xs font-medium text-[#627193]">
                {user.username || user.email}
              </span>
              {user.role && (
                <span className="text-xs text-gray-500 capitalize">
                  {user.role}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
