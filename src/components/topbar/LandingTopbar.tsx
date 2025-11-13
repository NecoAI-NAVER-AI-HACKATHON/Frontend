import { ChevronDown, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingTopbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      {/* Logo and bussiness */}
      <div className="flex items-center gap-10">
        {/* Logo and name */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <p className="text-2xl font-medium">NecoAI</p>
        </div>

        {/* Bussiness */}
        <div className="flex items-center gap-10">
          {/* Product button */}
          <div className="flex items-center gap-1 font-medium">
            <p className="text-sm">Product</p>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/* Solution button */}
          <div className="flex items-center gap-1 font-medium">
            <p className="text-sm">Solution</p>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/* Resources button */}
          <div className="flex items-center gap-1 font-medium">
            <p className="text-sm">Resources</p>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/* Documentation button */}
          <div className="flex items-center gap-1 font-medium">
            <p className="text-sm">Documentation</p>
          </div>

          {/* Pricing button */}
          <div className="flex items-center gap-1 font-medium">
            <p className="text-sm">Pricing</p>
          </div>
        </div>
      </div>

      {/* Login and contact button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border text-[#5C46FC] border-[#5C46FC] px-3 py-2 rounded-md text-sm">
          <p className="">Contact us</p>
        </div>

        <div
          className="border bg-[#5C46FC] hover:bg-[#4534BF] transition-colors duration-200 ease-in-out text-white px-5 py-2 rounded-md text-sm cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LandingTopbar;
