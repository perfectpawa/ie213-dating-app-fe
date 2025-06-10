// filepath: ie213-dating-app-fe/src/pages/AIAssistant.tsx
import React from 'react';
import Layout from '../components/layout/layout';
import BotChatWindow from '../components/chatComponent/BotChatWindow';

const AIAssistant: React.FC = () => {
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-4 px-4">
            <span className="text-[#4edcd8]">FAVOR </span>
            AI Assistant
          </h1>
          <div className="flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <BotChatWindow />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;