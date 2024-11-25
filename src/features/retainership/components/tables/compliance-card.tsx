import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ComplianceCard: React.FC = () => {
  const [tabs, setTabs] = useState(["App 1", "App 2", "App 3"]);
  const [selectedTab, setSelectedTab] = useState("App 1");

  // Function to add a new tab
  const addTab = () => {
    const newTab = `App ${tabs.length + 1}`;
    setTabs([...tabs, newTab]);
    setSelectedTab(newTab);
  };

  return (
    <div className="w-full p-6 shadow-md rounded-md bg-white">

      {/* Tabs Section */}
      <div className="flex items-center gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              selectedTab === tab ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
        {/* Add New Tab */}
        <button
          onClick={addTab}
          className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <Plus size={18} />
        </button>
      </div>

      <Separator />

      {/* Content Section */}
      <div className="mt-4">
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">Application Type:</span> Lorem Ipsum
          </p>
          <p>
            <span className="font-medium">Transaction ID:</span> 0000000000
          </p>
          <p>
            <span className="font-medium">Current Status:</span> Lorem Ipsum
          </p>
          <p>
            <span className="font-medium">IER:</span> Lorem Ipsum
          </p>
          <p>
            <span className="font-medium">Condition:</span> Lorem Ipsum
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCard;
