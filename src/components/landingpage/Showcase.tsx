import React, { useState } from "react";
import {
  LayoutDashboard,
  Waypoints,
  Activity,
  ChartColumn,
} from "lucide-react";

const Showcase = () => {
  const features = [
    {
      title: "Workplace management",
      icon: LayoutDashboard,
      img: "/workspace-management.png",
    },
    {
      title: "System builder",
      icon: Waypoints,
      img: "Feature 2 description",
    },
    {
      title: "Monitor and tracking",
      icon: Activity,
      img: "Feature 3 description",
    },
    {
      title: "Dashboard",
      icon: ChartColumn,
      img: "/dashboard.png",
    },
  ];

  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="flex flex-col gap-10 px-20">
      {/* Feature Tabs */}
      <div className="flex items-center justify-center gap-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = activeFeature === index;

          return (
            <div
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`cursor-pointer font-medium text-gray-600 hover:text-[#5C46FC] transition-colors`}
            >
              <div className="flex flex-col items-center">
                {/* Icon + Title */}
                <div className="flex items-center gap-3 px-10">
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-[#5C46FC]" : ""
                    } transition-colors`}
                  />
                  <p
                    className={`text-sm ${
                      isActive ? "text-[#5C46FC]" : ""
                    } transition-colors`}
                  >
                    {feature.title}
                  </p>
                </div>

                {/* Underline */}
                <div
                  className={`mt-3 h-[3px] w-full rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#5C46FC] scale-x-100"
                      : "bg-gray-300 scale-x-0"
                  } origin-center`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Preview */}
      <div className="bg-white shadow-lg p-10 rounded-xl flex justify-center">
        <img
          src={features[activeFeature].img}
          alt={features[activeFeature].title}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Showcase;
