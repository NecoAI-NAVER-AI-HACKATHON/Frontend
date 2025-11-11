import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0B0F1A] text-gray-300 py-16 px-10 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo + Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">NecoAI</h2>
          <span className="text-sm bg-[#5C46FC]/20 px-3 py-1 rounded-full w-fit">
            Powered by Naver AI
          </span>
          <p className="text-sm text-gray-400">
            Build, run & monitor your AI workflows — seamlessly integrated with
            Naver AI ecosystem.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-white mb-3">PRODUCT</h4>
          <ul className="space-y-2 text-sm">
            <li>Overview</li>
            <li>AI Workflow Builder</li>
            <li>Integration</li>
            <li>Monitoring</li>
            <li>Pricing</li>
            <li>What's new</li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold text-white mb-3">SOLUTIONS</h4>
          <ul className="space-y-2 text-sm">
            <li>Automation</li>
            <li>Data Processing</li>
            <li>Document Intelligence</li>
            <li>Localization</li>
            <li>AI Optimization</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-white mb-3">RESOURCES</h4>
          <ul className="space-y-2 text-sm">
            <li>Docs</li>
            <li>API Reference</li>
            <li>Templates</li>
            <li>Blog</li>
            <li>Community</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h4 className="font-semibold text-white mb-3">SUBSCRIBE</h4>
          <p className="text-sm mb-3">
            Get the latest updates on Naver AI workflow automation every week.
          </p>
          <div className="flex items-center bg-[#161B2B] rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-200 text-sm"
            />
            <button className="bg-[#5C46FC] hover:bg-[#4a38d8] px-4 py-2 text-sm font-semibold text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-16 border-t border-gray-700 pt-6 text-xs text-gray-500">
        <p>© 2025 NecoAI. All rights reserved.</p>
        <div className="flex gap-5 mt-3 md:mt-0">
          <a href="#" className="hover:text-gray-300">
            Security
          </a>
          <a href="#" className="hover:text-gray-300">
            Terms
          </a>
          <a href="#" className="hover:text-gray-300">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-300">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
