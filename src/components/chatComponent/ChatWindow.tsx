import { useEffect, useRef, useState } from "react";
import { Conversation, ChatMessage } from "../../api/chatApi";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { formatDate } from "../../utils/date";
import { useAuth } from "../../hooks/useAuth";

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  loading: boolean;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  loading,
}: ChatWindowProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (sending) return;

    setSending(true);
    try {
      await onSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Safety check for user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {" "}
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
              {conversation.user.profile?.profile_picture ? (
                <img
                  src={conversation.user.profile.profile_picture}
                  alt={conversation.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold">
                  {(conversation.user.profile?.full_name ||
                    conversation.user.username ||
                    "U")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {conversation.user.profile?.full_name ||
                  conversation.user.username ||
                  "Người dùng"}
              </h3>
              <p className="text-sm text-gray-500">{conversation.user.email}</p>
            </div>
          </div>
          {/* Loading indicator for real-time updates */}
          <div className="flex flex-col items-end">
            {loading && (
              <div className="flex items-center text-sm text-blue-500 mb-1">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Đang cập nhật...
              </div>
            )}
            <div className="text-xs text-gray-400">
              💬 Chỉ cập nhật khi gửi tin nhắn
            </div>
          </div>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              {loading
                ? "Đang tải tin nhắn..."
                : "Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!"}
            </p>
          </div>
        ) : (
          messages
            .filter((message) => message && message._id) // Filter out undefined/null messages
            .map((message) => {
              // Safety checks for message properties
              if (!message || !message._id) {
                console.warn("Invalid message object:", message);
                return null;
              }

              const isMyMessage = user._id === message.sender?._id;
              const messageTime = message.timestamp || message.createdAt;

              return (
                <Message
                  key={message._id}
                  isMyMessage={isMyMessage}
                  text={message.content || ""}
                  time={messageTime ? formatDate(messageTime) : ""}
                />
              );
            })
            .filter(Boolean) // Remove null entries
        )}
        <div ref={messagesEndRef} />{" "}
      </div>
      {/* Real-time status indicator */}{" "}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Cập nhật khi tương tác
        </div>
        <div>{messages.length} tin nhắn</div>
      </div>
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={sending} />
    </div>
  );
}
