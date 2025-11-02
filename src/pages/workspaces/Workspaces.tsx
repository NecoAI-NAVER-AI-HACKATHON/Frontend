import {
  CircleHelp,
  Search,
  ChevronRight,
  Clock,
  Plus,
  FolderOpen,
  CircleX,
  CirclePlus,
  X,
  ChevronDown,
  Waypoints,
} from "lucide-react";
import { WorkspaceMockData } from "./WorkspaceMockData";
import type { Workspace } from "../../types/workspaces";
import WorkspaceAdding from "../../components/workspaces/WorkspaceAdding";
import dayjs from "dayjs";
import { useState } from "react";

const Workspaces = () => {
  // Variables for modal
  const [showAddingWorkspace, setShowAddingWorkspace] =
    useState<boolean>(false);

  // Variables for filter buttons activate
  // =======================================================================
  const [clickedFilter, setClickedFilter] = useState<string>("");
  const [createdValue, setCreatedValue] = useState<string>("Oldest");
  const [nameValue, setNameValue] = useState<string>("A-Z");
  const [statusValue, setStatusValue] = useState<string>("All");
  const [activeDropdown, setActiveDropdown] = useState<string>("");
  // =======================================================================

  const toggleFilter = (title: string) => {
    setActiveDropdown("");
    if (clickedFilter === title) {
      setClickedFilter("");
    } else {
      setClickedFilter(title);
    }
  };

  // Values in filter buttons
  const filters = [
    {
      title: "Created at",
      options: ["Oldest", "Newest"],
      value: createdValue,
      setValue: setCreatedValue,
    },
    {
      title: "Name",
      options: ["A-Z", "Z-A"],
      value: nameValue,
      setValue: setNameValue,
    },
    {
      title: "Status",
      options: ["All", "Draft", "Inactive", "Active"],
      value: statusValue,
      setValue: setStatusValue,
    },
  ];

  // Clear filter button
  const clearFilters = () => {
    setClickedFilter("");
    setCreatedValue("Oldest");
    setNameValue("A-Z");
    setStatusValue("All");
    setActiveDropdown("");
  };

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-15 bg-white px-5">
        {/* Header */}
        <div className="flex flex-col py-2">
          <p className="text-xl font-medium">Workspaces</p>
          <p>Manage your AI workflow and workspaces</p>
        </div>

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
      <hr className="border-gray-300" />

      {/* Workspace */}
      <div className="flex-1 flex flex-col bg-white px-10">
        {/* Control bar */}
        <div className="flex flex-col mt-5">
          {/* Search bar */}
          <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 bg-[#F6F6F6] w-70">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for a workspace"
              className="flex-1 outline-none text-xs text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filter buttons list */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-1 text-xs bg-white text-[#627193] border-[#627193] ${
                    clickedFilter === filter.title ? "" : "border-dashed"
                  } border-2 rounded-xl py-1 px-2`}
                >
                  {clickedFilter === filter.title ? (
                    <>
                      <div
                        className="flex items-center gap-1 cursor-pointer transition"
                        onClick={() => toggleFilter(filter.title)}
                      >
                        <CircleX className="w-4 h-4" />
                        <span className="font-medium">{filter.title}</span>
                      </div>
                      <div className="w-[1px] h-4 bg-[#627193]"></div>
                      <div
                        className="flex items-center gap-1 cursor-pointer transition"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === filter.title ? "" : filter.title
                          )
                        }
                      >
                        <span className="font-medium text-[#5757F5]">
                          {filter.value}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      {activeDropdown === filter.title && (
                        <div className="absolute left-0 top-[110%] w-full bg-white rounded-md shadow-lg border mt-1 z-10">
                          {/* Tam giác chỉ lên */}
                          <div className="absolute top-[-6px] left-5 w-3 h-3 bg-white border-l border-t rotate-45" />
                          <p className="px-3 py-1 font-medium text-black">
                            Filter by <span>{filter.title}</span>
                          </p>
                          <ul className="flex flex-col">
                            {filter.options.map((opt) => (
                              <li
                                key={opt}
                                onClick={() => {
                                  filter.setValue(opt);
                                  setActiveDropdown("");
                                }}
                                className={`px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer ${
                                  filter.value === opt
                                    ? "text-[#5757F5] font-medium"
                                    : ""
                                }`}
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className="flex items-center cursor-pointer transition gap-1"
                      onClick={() => toggleFilter(filter.title)}
                    >
                      <CirclePlus className="w-4 h-4" />
                      <span className="font-medium">{filter.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Clear Filter button */}
            <button
              className="flex items-center gap-1 text-xs text-[#627193] cursor-pointer transition"
              onClick={clearFilters}
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Workspace cards */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          {/* Create new workspace button */}
          <div
            className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-5 cursor-pointer hover:bg-[#EDEDED] transition duration-300 ease-in-out"
            onClick={() => setShowAddingWorkspace(true)}
          >
            <div className="flex items-center justify-center rounded-md w-15 h-15 text-[#5757F5] border border-gray-300">
              <Plus />
            </div>
            <p className="font-medium">New Workspace</p>
            <p className="text-xs">Create a new workspace</p>
          </div>

          {/* Workspace cards */}
          {WorkspaceMockData.map((workspace: Workspace) => (
            <div
              key={workspace.id}
              className="bg-white border border-gray-300 rounded-lg p-5 cursor-pointer hover:bg-[#EDEDED] transition duration-300 ease-in-out"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center rounded-md w-10 h-10 text-[#5757F5] border border-gray-300">
                    <FolderOpen />
                  </div>
                  <div className="text-[#627193]">
                    <ChevronRight />
                  </div>
                </div>

                {/* Workspace name */}
                <p className="text-sm font-medium">{workspace.name}</p>

                {/* Workspace description */}
                <p className="text-xs">{workspace.description}</p>

                {/* Workspace created time and status */}
                <div className="flex items-center justify-between mt-3">
                  {/* Created at information */}
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#627193] w-5 h-5" />
                    <p className="text-xs font-medium text-[#627193]">
                      {dayjs(workspace.created_at).format("YYYY-MMM-DD")}
                    </p>
                  </div>

                  {/* Systems counts information */}
                  <div className="flex items-center gap-2">
                    <Waypoints className="text-[#627193] w-5 h-5" />
                    <p className="text-xs font-medium text-[#627193]">
                      {workspace.system_count}
                    </p>
                  </div>

                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      workspace.status === "active"
                        ? "border border-[#37a14e] text-[#37a14e]"
                        : workspace.status === "inactive"
                        ? "border border-gray-400 text-gray-400"
                        : "border border-yellow-500 text-yellow-500"
                    }`}
                  >
                    {workspace.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Create Workspace */}
      {showAddingWorkspace && (
        <WorkspaceAdding setShowAddingWorkspace={setShowAddingWorkspace} />
      )}
    </div>
  );
};

export default Workspaces;
