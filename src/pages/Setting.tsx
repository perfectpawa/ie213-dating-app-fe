import LeftSideSetting from "@/components/Setting/LeftSideSetting";
import RightSideSetting from "@/components/Setting/RightSideSetting";
import { useState } from "react";
import Layout from "../components/layout/layout";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  return (
      <Layout>
        <div className="flex">
          <LeftSideSetting activeTab={activeTab} setActiveTab={setActiveTab} />
          <RightSideSetting activeTab={activeTab} />
        </div>
      </Layout>
  );
};
export default Setting;
