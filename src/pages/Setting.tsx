import LeftSideSetting from "@/components/Setting/LeftSideSetting";
import RightSideSetting from "@/components/Setting/RightSideSetting";
import React, { useState } from "react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  return (
    <div className="flex">
      <LeftSideSetting activeTab={activeTab} setActiveTab={setActiveTab} />
      <RightSideSetting activeTab={activeTab} />
    </div>
  );
};
export default Setting;
