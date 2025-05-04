import React, { useState } from "react";
import SettingProfile from "./SettingProfile";
import SettingMessageRespond from "./SettingMessageRespond";
import SettingPrivate from "./SettingPrivate";
import SettingComment from "./SettingComment";
import SettingBlock from "./SettingBlock";

interface RightSideSettingProps {
  activeTab: string;
}

const RightSideSetting: React.FC<RightSideSettingProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <SettingProfile />;
      case "block":
        return <SettingBlock />;
      case "comment":
        return <SettingComment />;
      case "message":
        return <SettingMessageRespond />;
      case "private":
        return <SettingPrivate />;
    }
  };

  return <div className="w-[70%]">{renderContent()}</div>;
};
export default RightSideSetting;
