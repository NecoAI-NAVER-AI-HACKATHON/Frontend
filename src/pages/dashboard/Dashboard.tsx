import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import {
  Activity,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Cpu,
  TrendingUp,
  Users,
  AlertTriangle,
  Server,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import TopBar from "@/components/topbar/TopBar";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const workflowStats = [
    { name: "Mon", runs: 120, success: 115, failed: 5 },
    { name: "Tue", runs: 98, success: 95, failed: 3 },
    { name: "Wed", runs: 150, success: 145, failed: 5 },
    { name: "Thu", runs: 130, success: 125, failed: 5 },
    { name: "Fri", runs: 200, success: 192, failed: 8 },
    { name: "Sat", runs: 80, success: 78, failed: 2 },
    { name: "Sun", runs: 70, success: 68, failed: 2 },
  ];

  const performanceData = [
    { time: "00:00", cpu: 45, memory: 62, network: 30 },
    { time: "04:00", cpu: 52, memory: 58, network: 25 },
    { time: "08:00", cpu: 78, memory: 75, network: 65 },
    { time: "12:00", cpu: 85, memory: 82, network: 78 },
    { time: "16:00", cpu: 92, memory: 88, network: 85 },
    { time: "20:00", cpu: 68, memory: 70, network: 55 },
  ];

  const workflowDistribution = [
    { name: "OCR", value: 35, color: "#5C46FC" },
    { name: "Translation", value: 25, color: "#00C2FF" },
    { name: "Summarization", value: 20, color: "#FF7B7B" },
    { name: "Data Processing", value: 15, color: "#FFB800" },
    { name: "Others", value: 5, color: "#00D9B1" },
  ];

  const aiModelPerformance = [
    {
      model: "CLOVA Studio",
      accuracy: 95,
      speed: 85,
      cost: 70,
      reliability: 92,
    },
    { model: "CLOVA OCR", accuracy: 93, speed: 88, cost: 75, reliability: 95 },
    {
      model: "CLOVA GreenEye",
      accuracy: 90,
      speed: 92,
      cost: 80,
      reliability: 88,
    },
    {
      model: "CLOVA Speed",
      accuracy: 85,
      speed: 95,
      cost: 90,
      reliability: 85,
    },
  ];

  const apiEndpoints = [
    { endpoint: "/api/ocr", calls: 1243, avgTime: "2.3s", status: "Healthy" },
    {
      endpoint: "/api/translate",
      calls: 892,
      avgTime: "1.8s",
      status: "Healthy",
    },
    {
      endpoint: "/api/summarize",
      calls: 654,
      avgTime: "3.5s",
      status: "Degraded",
    },
    {
      endpoint: "/api/analyze",
      calls: 423,
      avgTime: "4.2s",
      status: "Healthy",
    },
  ];

  const recentWorkflows = [
    {
      name: "OCR + Translation",
      status: "Success",
      time: "3.2s",
      date: "2m ago",
    },
    {
      name: "Data Enrichment",
      status: "Success",
      time: "5.1s",
      date: "12m ago",
    },
    { name: "Summarization Bot", status: "Failed", time: "-", date: "1h ago" },
    {
      name: "Report Generator",
      status: "Success",
      time: "8.7s",
      date: "2h ago",
    },
  ];

  const kpis = [
    {
      title: "Active Workflows",
      value: 42,
      change: "+12%",
      trend: "up",
      icon: <Activity className="w-6 h-6 text-[#5C46FC]" />,
      color: "bg-gradient-to-br from-[#E6E8FF] to-[#D4D6FF]",
    },
    {
      title: "Executions Today",
      value: 314,
      change: "+24%",
      trend: "up",
      icon: <Zap className="w-6 h-6 text-[#00C2FF]" />,
      color: "bg-gradient-to-br from-[#D9F6FF] to-[#B8EEFF]",
    },
    {
      title: "Average Runtime",
      value: "2.8s",
      change: "-8%",
      trend: "down",
      icon: <Clock className="w-6 h-6 text-[#00D9B1]" />,
      color: "bg-gradient-to-br from-[#D9FFF4] to-[#B8FFE8]",
    },
    {
      title: "Success Rate",
      value: "97.2%",
      change: "+2.1%",
      trend: "up",
      icon: <CheckCircle className="w-6 h-6 text-[#00D980]" />,
      color: "bg-gradient-to-br from-[#D9FFE8] to-[#B8FFD4]",
    },
    {
      title: "Failed Runs",
      value: 3,
      change: "-50%",
      trend: "down",
      icon: <AlertTriangle className="w-6 h-6 text-[#FF7B7B]" />,
      color: "bg-gradient-to-br from-[#FFE6E6] to-[#FFD4D4]",
    },
    {
      title: "Active Users",
      value: 128,
      change: "+18%",
      trend: "up",
      icon: <Users className="w-6 h-6 text-[#FFB800]" />,
      color: "bg-gradient-to-br from-[#FFF4D9] to-[#FFE8B8]",
    },
    {
      title: "API Calls",
      value: "3.2K",
      change: "+32%",
      trend: "up",
      icon: <Server className="w-6 h-6 text-[#9C46FC]" />,
      color: "bg-gradient-to-br from-[#F0E8FF] to-[#E4D6FF]",
    },
    {
      title: "Uptime",
      value: "99.9%",
      change: "0%",
      trend: "stable",
      icon: <Globe className="w-6 h-6 text-[#00A8FF]" />,
      color: "bg-gradient-to-br from-[#D9F0FF] to-[#B8E4FF]",
    },
  ];

  return (
    <div className="flex flex-col bg-white h-screen">
      {/* Top Bar */}
      <TopBar />
      <hr className="border-gray-300" />

      <div className="flex-1 flex flex-col gap-6 px-10 bg-gradient-to-br from-[#F5F7FF] via-[#F9FAFF] to-[#FFF9F5] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            {/* Headers */}
            <div className="flex flex-col mt-5">
              <div className="flex items-center gap-2 text-[#5C46FC]">
                <BarChart3 />
                <p className="text-xl font-medium">Analytics Dashboard</p>
              </div>
              <p className="font-medium text-[#627193]">
                Real-time insights for your AI workflows
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${kpi.color}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm">
                    {kpi.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      kpi.trend === "up"
                        ? "text-green-600"
                        : kpi.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {kpi.trend === "up" && <ArrowUp className="w-4 h-4" />}
                    {kpi.trend === "down" && <ArrowDown className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-gray-700 text-sm font-medium mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {kpi.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Executions */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#5C46FC]" />
                  Workflow Executions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Success vs Failed runs
                </p>
              </div>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowStats}>
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="success"
                    fill="#00D980"
                    radius={[6, 6, 0, 0]}
                    name="Success"
                  />
                  <Bar
                    dataKey="failed"
                    fill="#FF7B7B"
                    radius={[6, 6, 0, 0]}
                    name="Failed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workflow Distribution */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[#00C2FF]" />
              <h2 className="text-xl font-bold text-gray-800">Distribution</h2>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workflowDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workflowDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {workflowDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance & AI Models Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Performance */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-[#FFB800]" />
              <h2 className="text-xl font-bold text-gray-800">
                System Performance
              </h2>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5C46FC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5C46FC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorMemory"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorNetwork"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00D9B1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D9B1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stroke="#5C46FC"
                    fillOpacity={1}
                    fill="url(#colorCpu)"
                    name="CPU %"
                  />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stroke="#00C2FF"
                    fillOpacity={1}
                    fill="url(#colorMemory)"
                    name="Memory %"
                  />
                  <Area
                    type="monotone"
                    dataKey="network"
                    stroke="#00D9B1"
                    fillOpacity={1}
                    fill="url(#colorNetwork)"
                    name="Network %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Model Performance */}
          <div className="bg-white p-6 rounded-2xl ">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#9C46FC]" />
              <h2 className="text-xl font-bold text-gray-800">
                AI Model Performance
              </h2>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={aiModelPerformance}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="model" stroke="#666" />
                  <PolarRadiusAxis stroke="#999" />
                  <Radar
                    name="Accuracy"
                    dataKey="accuracy"
                    stroke="#5C46FC"
                    fill="#5C46FC"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Speed"
                    dataKey="speed"
                    stroke="#00C2FF"
                    fill="#00C2FF"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Cost Efficiency"
                    dataKey="cost"
                    stroke="#00D9B1"
                    fill="#00D9B1"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* API Endpoints & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Endpoints */}
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#00A8FF]" />
              API Endpoint Status
            </h2>
            <div className="space-y-3">
              {apiEndpoints.map((api, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {api.endpoint}
                    </p>
                    <p className="text-sm text-gray-500">
                      {api.calls.toLocaleString()} calls
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {api.avgTime}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        api.status === "Healthy"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Workflows */}
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#5C46FC]" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentWorkflows.map((wf, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center gap-3">
                    {wf.status === "Success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{wf.name}</p>
                      <p className="text-sm text-gray-500">{wf.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        wf.status === "Failed"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {wf.status}
                    </p>
                    <p className="text-sm text-gray-600">{wf.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
