import { useEffect, useState } from "react";
import ChatWindow from "@/components/chatComponent/ChatWindow.tsx";
import FriendList from "@/components/chatComponent/FriendList.tsx";
import Layout from "@/components/layout/layout";
import { useChat } from "../hooks/useChat";
import ChatDebug from "../components/ChatDebug";
import Toast from "../components/ui/Toast";
import { requestNotificationPermission } from "../utils/notifications";

export default function Chat() {
    const [showDebug, setShowDebug] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<string>('default');    const {
        conversations,
        messages,
        selectedConversation,
        loading,
        error,
        sendMessage,
        selectConversation,
        setError,
        refreshCurrentConversation,
        newMessageAlert,
        setNewMessageAlert,    } = useChat();

    useEffect(() => {
        if (error) {
            console.error('Chat error:', error);
        }
    }, [error]);

    // Check notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        setNotificationPermission(granted ? 'granted' : 'denied');
    };

    // Wrapper for sendMessage to match ChatWindow interface
    const handleSendMessage = async (content: string) => {
        await sendMessage(content);
    };

    // Error handling
    if (error && error.includes('undefined')) {
        return (
            <Layout>
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Lỗi dữ liệu</h2>
                        <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải dữ liệu tin nhắn</p>
                        <button 
                            onClick={() => {
                                setError(null);
                                window.location.reload();
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }    return (
        <Layout>
            {/* Toast Notification for new messages */}
            {newMessageAlert && (
                <Toast
                    message={newMessageAlert}
                    type="info"
                    onClose={() => setNewMessageAlert(null)}
                />
            )}
            
            <div className="h-screen flex">
                {/* Debug Toggle */}
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                </button>                {/* Refresh Button */}
                <button
                    onClick={refreshCurrentConversation}
                    className="fixed top-4 right-24 z-50 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    title="Làm mới tin nhắn"
                >
                    🔄 Làm mới
                </button>

                {/* Notification Settings */}
                {notificationPermission !== 'granted' && (
                    <button
                        onClick={handleEnableNotifications}
                        className="fixed top-4 right-44 z-50 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        title="Bật thông báo"
                    >
                        🔔 Thông báo
                    </button>
                )}

                {showDebug && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <ChatDebug />
                            <button
                                onClick={() => setShowDebug(false)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Close Debug
                            </button>
                        </div>
                    </div>
                )}

                {/* Friend List */}
                <div className="w-1/3 border-r border-gray-300">
                    <FriendList
                        conversations={conversations}
                        onSelectConversation={selectConversation}
                        selectedConversation={selectedConversation}
                        loading={loading}
                    />
                </div>

                {/* Chat Window */}
                <div className="flex-1">
                    {selectedConversation ? (                        <ChatWindow
                            conversation={selectedConversation}
                            messages={messages || []} // Ensure messages is never undefined
                            onSendMessage={handleSendMessage}
                            loading={loading}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}