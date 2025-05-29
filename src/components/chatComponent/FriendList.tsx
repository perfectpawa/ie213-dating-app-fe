import { Conversation } from "../../api/chatApi";
import { formatDate } from "../../utils/date";
import avatarHolder from "../../assets/avatar_holder.png";

interface FriendListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
  loading: boolean;
}

export default function FriendList({
  conversations,
  onSelectConversation,
  selectedConversation,
  loading,
}: FriendListProps) {
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p>Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm mt-2">
              Hãy ghép đôi với ai đó để bắt đầu trò chuyện!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-black">Tin nhắn</h2>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const displayName =
            conversation.user.profile?.full_name ||
            conversation.user.username ||
            "Người dùng";
          const lastMessageText =
            conversation.lastMessage?.content || "Chưa có tin nhắn";
          const timestamp = conversation.lastMessage?.timestamp
            ? formatDate(conversation.lastMessage.timestamp)
            : formatDate(conversation.matchDate);

          const isSelected =
            selectedConversation?.user._id === conversation.user._id;

          return (
            <li
              key={conversation.user._id}
              onClick={() => onSelectConversation(conversation)}
              className={`flex items-center justify-between p-4 cursor-pointer text-black hover:bg-gray-200 border-b transition-colors ${
                isSelected ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {conversation.user.profile?.profile_picture ? (
                    <img
                      src={conversation.user.profile.profile_picture}
                      alt={`${displayName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={avatarHolder}
                      alt={`${displayName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="font-medium text-left truncate">
                      {displayName}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 text-left truncate">
                    {lastMessageText}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-2">{timestamp}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
