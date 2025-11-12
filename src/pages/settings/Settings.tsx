import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Database,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Save,
  Check,
} from "lucide-react";
import TopBar from "@/components/topbar/TopBar";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    company: "Tech Corp",
    role: "Developer",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    securityAlerts: true,
    theme: "light",
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    twoFactor: false,
    sessionTimeout: "30",
    apiKey: "sk_live_xxxxxxxxxxxxxxxxxxxx",
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: <Palette className="w-5 h-5" />,
    },
    { id: "api", name: "API Keys", icon: <Key className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFF]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <TopBar />
        <hr className="border-gray-200" />
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-[#5C46FC] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
                {activeTab === tab.id && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-70" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFF]">
          <div className="bg-white rounded-2xl border border-gray-300 p-8">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Update your name, email, and company details.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden">
                    <img
                      src="default-avt.svg"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#5C46FC] text-white rounded-lg hover:bg-[#4338ca] font-medium transition">
                      Change Avatar
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, GIF, or PNG up to 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ["Full Name", "fullName"],
                    ["Email", "email"],
                    ["Phone", "phone"],
                    ["Company", "company"],
                    ["Role", "role"],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={(settings as any)[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C46FC]/30 focus:border-[#5C46FC] transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Notification Preferences
                </h2>
                <p className="text-gray-500 text-sm">
                  Control how you receive updates.
                </p>

                {[
                  {
                    title: "Email Notifications",
                    desc: "Receive email updates about workflows.",
                    icon: <Mail className="w-5 h-5 text-blue-500" />,
                    color: "bg-blue-50",
                    field: "emailNotifications",
                  },
                  {
                    title: "Push Notifications",
                    desc: "Get push notifications on your devices.",
                    icon: <Smartphone className="w-5 h-5 text-green-500" />,
                    color: "bg-green-50",
                    field: "pushNotifications",
                  },
                  {
                    title: "Weekly Report",
                    desc: "Receive weekly summary of performance.",
                    icon: <Database className="w-5 h-5 text-purple-500" />,
                    color: "bg-purple-50",
                    field: "weeklyReport",
                  },
                  {
                    title: "Security Alerts",
                    desc: "Get notified about security events.",
                    icon: <Shield className="w-5 h-5 text-red-500" />,
                    color: "bg-red-50",
                    field: "securityAlerts",
                  },
                ].map((n) => (
                  <div
                    key={n.field}
                    className="flex items-center justify-between border border-gray-200 p-4 rounded-xl hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${n.color}`}>
                        {n.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {n.title}
                        </h3>
                        <p className="text-sm text-gray-500">{n.desc}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(settings as any)[n.field]}
                      onChange={(e) => handleChange(n.field, e.target.checked)}
                      className="w-5 h-5 accent-[#5C46FC]"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Appearance Settings
                </h2>
                <p className="text-gray-500 text-sm">
                  Customize the look and feel of your workspace.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "light", icon: <Sun />, label: "Light" },
                    { value: "dark", icon: <Moon />, label: "Dark" },
                    { value: "system", icon: <Monitor />, label: "System" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleChange("theme", t.value)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        settings.theme === t.value
                          ? "border-[#5C46FC] bg-[#F5F4FF]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="p-2 bg-gray-50 rounded-full text-gray-700 mb-2">
                        {t.icon}
                      </div>
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleChange("language", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C46FC]/30 focus:border-[#5C46FC] transition-all"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C46FC]/30 focus:border-[#5C46FC] transition-all"
                    >
                      <option value="Asia/Ho_Chi_Minh">
                        Ho Chi Minh (GMT+7)
                      </option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">API Keys</h2>
                <p className="text-gray-500 text-sm">
                  Manage your integration credentials.
                </p>

                <div className="p-6 rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Production API Key
                      </h3>
                      <p className="text-sm text-gray-500">
                        Use this key for live environment.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
                      Regenerate
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg">
                    <code className="flex-1 text-gray-700 font-mono text-sm truncate">
                      {settings.apiKey}
                    </code>
                    <button className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-10 pt-6 border-t border-gray-200">
              <button className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mr-3 font-medium">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#5C46FC] text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition"
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
