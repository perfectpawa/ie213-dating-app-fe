import { useEffect, useRef, useState } from "react";
import { Conversation, ChatMessage } from "../../api/chatApi";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { formatDate } from "../../utils/date";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import avatarHolder from "../../assets/avatar_holder.png";

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
  const { navigateToProfile } = useProfile();
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
        <p className="text-white">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {" "}
      {/* Chat Header */}{" "}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full bg-gray-700/50 mr-3 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateToProfile(conversation.user._id)}
            >
              {/* Get profile picture with complete fallbacks */}
              {(() => {
                const profilePicture =
                  // Root level properties (new API)
                  conversation.user.profile_picture ||
                  // Legacy profile object properties
                  conversation.user.profile?.profile_picture;

                return profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={conversation.user.username}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = avatarHolder; // Fallback to default avatar
                      console.log(
                        "Chat window - Image load failed, using fallback"
                      );
                    }}
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {(conversation.user.user_name ||
                      conversation.user.full_name ||
                      conversation.user.profile?.full_name ||
                      conversation.user.profile?.user_name ||
                      conversation.user.username ||
                      "U")[0].toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateToProfile(conversation.user._id)}
            >
              <h3 className="font-semibold text-left text-white">
                {/* Get the user information with full proper fallbacks */}
                {conversation.user.full_name ||
                  conversation.user.profile?.full_name ||
                  conversation.user.profile?.user_name ||
                  "Người dùng"}
              </h3>
              <p className="text-left text-sm text-gray-300">
                {conversation.user.user_name}
              </p>
            </div>
          </div>          {/* Loading/Status indicators for real-time updates */}
          <div className="flex flex-col items-end">
            {/* {loading && (
              <div className="flex items-center text-sm text-blue-300 mb-1">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
                Đang cập nhật...
              </div>
            )} */}
            {conversation.unreadCount === 0 && (
              <div className="flex items-center text-sm text-[#4edcd8] mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Đã đọc
              </div>
            )}
            {/* <div className="text-xs text-gray-300">
              💬 Tự động cập nhật khi có tin nhắn mới
            </div> */}
          </div>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-center">
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

              // Enhanced logging of message sender information
              console.log("Message sender data:", {
                id: message.sender?._id,
                user_name: message.sender?.user_name,
                profile_picture: message.sender?.profile_picture,
              });

              const isMyMessage = user._id === message.sender?._id;
              const messageTime = message.timestamp || message.createdAt; // Get sender name and profile picture with fallbacks
              const senderName = isMyMessage
                ? null
                : message.sender?.user_name ||
                  message.sender?.profile?.full_name ||
                  message.sender?.profile?.user_name ||
                  conversation.user.user_name ||
                  conversation.user.full_name ||
                  conversation.user.profile?.full_name ||
                  conversation.user.profile?.user_name ||
                  conversation.user.username ||
                  "Người dùng";

              const senderImage = isMyMessage
                ? null
                : message.sender?.profile_picture ||
                  message.sender?.profile?.profile_picture ||
                  conversation.user.profile_picture ||
                  conversation.user.profile?.profile_picture;

              return (
                <Message
                  key={message._id}
                  isMyMessage={isMyMessage}
                  text={message.content || ""}
                  time={messageTime ? formatDate(messageTime) : ""}
                  senderName={senderName}
                  senderImage={senderImage}
                />
              );
            })
            .filter(Boolean) // Remove null entries
        )}
        <div ref={messagesEndRef} />{" "}
      </div>
      {/* Real-time status indicator */}{" "}
      <div className="px-4 py-2 border-t border-gray-700/50 text-xs text-gray-300 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Hiện đang trực tuyến
        </div>
        <div>{messages.length} tin nhắn</div>
      </div>
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={sending} />
    </div>
  );
}
