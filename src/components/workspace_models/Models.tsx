import { ChevronRight, ChevronDown, Box, Upload } from "lucide-react";
import type { Model } from "../../types/model";
import ModelAdding from "./ModelAdding";
import { ModelsData } from "../../mockdata/ModelsData";
import dayjs from "dayjs";
import { useState } from "react";

const Models = () => {
  // Variables for modal
  const [showAddingModel, setShowAddingModel] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      {/* Models content */}
      <div className="flex flex-col">
        {/* Header and Add model button */}
        <div className="flex items-center justify-between mt-5">
          {/* Header */}
          <div className="flex flex-col">
            <p className="text-sm font-medium">AI Models</p>
            <p className="text-xs">Manage your private and public AI models</p>
          </div>

          {/* Add system button */}
          <div
            className="flex items-center gap-2 cursor-pointer bg-[#5757F5] text-white px-3 py-2 rounded-md"
            onClick={() => setShowAddingModel(true)}
          >
            <Upload className="w-4 h-4" />
            <p className="text-sm">Upload Model</p>
          </div>
        </div>

        {/* Private models cards */}
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center gap-2 text-[#5757F5]">
            <p className="font-medium">Private Models</p>
            <ChevronDown />
          </div>

          {/* Have no models */}
          {ModelsData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-xl py-10">
              <p className="text-sm font-medium">No private models yet</p>
              <p className="text-xs text-[#627193]">
                Upload your first model to get started
              </p>
            </div>
          )}

          {/* Have model cards */}
          <div className="grid grid-cols-3 gap-5 mt-2">
            {ModelsData.filter((model) => !model.is_public).map(
              (model: Model) => (
                <div
                  key={model.id}
                  className="bg-white border-2 border-gray-300 rounded-2xl p-5 cursor-pointer 
               transition duration-300 ease-in-out
               hover:bg-[#F9FAFB] hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center rounded-md w-10 h-10 text-[#5757F5] border border-[#5757F5]">
                        <Box />
                      </div>
                      <div className="text-[#627193]">
                        <ChevronRight />
                      </div>
                    </div>

                    {/* Workspace name */}
                    <p className="text-sm font-medium">{model.name}</p>

                    {/* Model type */}
                    <p className="text-xs">{model.type}</p>

                    {/* Workspace created time and status */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Created at information */}
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-[#627193]">
                          Last updated:
                        </p>
                        <p className="text-sm font-medium text-[#627193]">
                          {dayjs(model.created_at).format("YYYY-MMM-DD")}
                        </p>
                      </div>

                      {/* Tag model */}
                      <div className="rounded-md px-2 py-1 text-xs font-medium border border-[#FF6467] text-[#FF6467]">
                        Private model
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Public models cards */}
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center gap-2 text-[#5757F5]">
            <p className="font-medium">Public Models</p>
            <ChevronDown />
          </div>

          {/* Have no models */}
          {ModelsData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-xl py-10">
              <p className="text-sm font-medium">No public models yet</p>
              <p className="text-xs text-[#627193]">
                Upload your first model to get started
              </p>
            </div>
          )}

          {/* Have model cards */}
          <div className="grid grid-cols-3 gap-5 mt-2">
            {ModelsData.filter((model) => model.is_public).map(
              (model: Model) => (
                <div
                  key={model.id}
                  className="bg-white border-2 border-gray-300 rounded-2xl p-5 cursor-pointer 
               transition duration-300 ease-in-out
               hover:bg-[#F9FAFB] hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center rounded-md w-10 h-10 text-[#5757F5] border border-[#5757F5]">
                        <Box />
                      </div>
                      <div className="text-[#627193]">
                        <ChevronRight />
                      </div>
                    </div>

                    {/* Workspace name */}
                    <p className="text-sm font-medium">{model.name}</p>

                    {/* Model type */}
                    <p className="text-xs">{model.type}</p>

                    {/* Workspace created time and status */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Created at information */}
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-[#627193]">
                          Last updated:
                        </p>
                        <p className="text-sm font-medium text-[#627193]">
                          {dayjs(model.created_at).format("YYYY-MMM-DD")}
                        </p>
                      </div>

                      {/* Tag model */}
                      <div className="rounded-md px-2 py-1 text-xs font-medium border border-[#37a14e] text-[#37a14e]">
                        Public model
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Modal Create System */}
        {showAddingModel && (
          <ModelAdding setShowAddingModel={setShowAddingModel} />
        )}
      </div>
    </div>
  );
};

export default Models;
