import React from "react";

const WorkspacesSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border-2 border-gray-300 rounded-2xl p-5 animate-pulse"
        >
          <div className="flex flex-col gap-2">
            {/* Top icons */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gray-200 rounded-md border border-gray-300" />
              <div className="w-4 h-4 bg-gray-200 rounded" />
            </div>

            {/* Name */}
            <div className="w-40 h-4 bg-gray-200 rounded" />

            {/* Description */}
            <div className="w-full h-3 bg-gray-200 rounded" />

            {/* Footer row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="w-8 h-3 bg-gray-200 rounded" />
              </div>

              <div className="w-16 h-6 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WorkspacesSkeleton;
