import React, { useEffect, useState, useRef } from "react";
import ChatWindow from "@/components/chatComponent/ChatWindow.tsx";
import FriendList from "@/components/chatComponent/FriendList.tsx";
import Layout from "@/components/layout/layout";
import { useChat } from "../hooks/useChat";
import ChatDebug from "../components/ChatDebug";
import Toast from "../components/ui/Toast";
import { requestNotificationPermission } from "../utils/notifications";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [showDebug, setShowDebug] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<string>("default");
  const { matchId } = useParams<{ matchId: string }>();

  const {
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
    setNewMessageAlert,
    selectConversationByMatchId,
    createNewConversation, // Thêm method này
  } = useChat();
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
    }
  }, [error]);
  // Tham chiếu để theo dõi khi đã chọn cuộc hội thoại
  const conversationSelectedRef = useRef(false);

  // Handle automatic conversation selection when matchId is in the URL or sessionStorage
  useEffect(() => {
    const autoSelectConversation = async () => {
      console.log("=== autoSelectConversation called ===");
      console.log("State:", {
        conversationsLength: conversations.length,
        conversationSelectedRef: conversationSelectedRef.current,
        matchId,
        selectedConversation: selectedConversation?.user._id,
      });

      // Debug sessionStorage ngay từ đầu
      const debugSessionStorage = {
        activeMatchId: sessionStorage.getItem("activeMatchId"),
        matchedUserId: sessionStorage.getItem("matchedUserId"),
        DEBUG_matchResult: sessionStorage.getItem("DEBUG_matchResult"),
      };
      console.log("SessionStorage at start:", debugSessionStorage);

      if (conversations.length > 0 && !conversationSelectedRef.current) {
        let targetConversation = null;
        let matchReason = "";

        if (matchId) {
          console.log("Looking for conversation with matchId:", matchId);

          // Debug: in ra tất cả matchId của conversations
          console.log("All conversation matchIds:", conversations.map((c) => c.matchId));

          // Priority 1: Exact matchId match
          targetConversation = conversations.find((conv) => conv.matchId === matchId);
          if (targetConversation) {
            matchReason = "Exact matchId match";
          }

          // Priority 2: User ID match (matchId có thể là userId)
          if (!targetConversation) {
            targetConversation = conversations.find((conv) => conv.user._id === matchId);
            if (targetConversation) {
              matchReason = "User ID match";
            }
          }

          // Priority 3: SessionStorage matchId
          if (!targetConversation) {
            const storedMatchId = sessionStorage.getItem("activeMatchId");
            if (storedMatchId) {
              targetConversation = conversations.find((conv) => conv.matchId === storedMatchId);
              if (targetConversation) {
                matchReason = "SessionStorage matchId match";
              }
            }
          }

          // Priority 4: SessionStorage userId
          if (!targetConversation) {
            const storedUserId = sessionStorage.getItem("matchedUserId");
            if (storedUserId) {
              targetConversation = conversations.find((conv) => conv.user._id === storedUserId);
              if (targetConversation) {
                matchReason = "SessionStorage user ID match";
              }
            }
          }

          if (targetConversation) {
            console.log("=== CONVERSATION FOUND ===");
            console.log("Match reason:", matchReason);
            console.log("Target conversation:", {
              userId: targetConversation.user._id,
              userName: targetConversation.user.user_name || targetConversation.user.username,
              matchId: targetConversation.matchId,
            });

            await selectConversation(targetConversation);
            conversationSelectedRef.current = true;

            // Clear sessionStorage
            sessionStorage.removeItem("activeMatchId");
            sessionStorage.removeItem("matchedUserId");
            sessionStorage.removeItem("DEBUG_matchResult");
          } else {
            console.log("=== NO CONVERSATION FOUND ===");
            console.log("Available options:");
            console.log("- URL matchId:", matchId);
            console.log("- SessionStorage matchId:", sessionStorage.getItem("activeMatchId"));
            console.log("- SessionStorage userId:", sessionStorage.getItem("matchedUserId"));
            console.log("- Available conversations:", conversations.map((c) => ({
              userId: c.user._id,
              matchId: c.matchId,
              userName: c.user.user_name,
            })));

            // Thử tạo conversation mới hoặc chọn conversation đầu tiên nếu không tìm thấy
            const matchedUserId = sessionStorage.getItem("matchedUserId");
            if (matchedUserId && createNewConversation) {
              console.log("Attempting to create new conversation...");
              const created = await createNewConversation(matchedUserId, matchId);
              if (created) {
                conversationSelectedRef.current = true;
              }
            } else {
              console.log("No way to create conversation, will select first available");
              // Fallback: chọn conversation đầu tiên
              if (conversations.length > 0) {
                console.log("Selecting first conversation as fallback");
                await selectConversation(conversations[0]);
                conversationSelectedRef.current = true;
              }
            }
          }
        }
      } else {
        console.log("Skip autoSelect:", {
          hasConversations: conversations.length > 0,
          alreadySelected: conversationSelectedRef.current,
        });
      }
    };

    autoSelectConversation();
  }, [matchId, conversations, selectConversation, createNewConversation]);

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? "granted" : "denied");
  };

  // Wrapper for sendMessage to match ChatWindow interface
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // Reset ref khi component mount hoặc khi matchId thay đổi
  useEffect(() => {
    conversationSelectedRef.current = false;
    console.log("Reset conversationSelectedRef for matchId:", matchId);
  }, [matchId]);

  // Thêm useEffect để theo dõi khi selectedConversation thay đổi
  useEffect(() => {
    if (selectedConversation) {
      console.log("selectedConversation changed:", {
        user: selectedConversation.user.user_name || selectedConversation.user.username,
        userId: selectedConversation.user._id,
      });
    }
  }, [selectedConversation]);



  // Cập nhật useEffect trong Chat.tsx để debug conversations loading
  useEffect(() => {
    console.log("=== Chat conversations updated ===");
    console.log("Conversations count:", conversations.length);
    console.log("Current matchId from URL:", matchId);
    console.log("SessionStorage data:", {
      activeMatchId: sessionStorage.getItem("activeMatchId"),
      matchedUserId: sessionStorage.getItem("matchedUserId"),
      DEBUG_activeMatchId: sessionStorage.getItem("DEBUG_activeMatchId"),
      DEBUG_matchedUserId: sessionStorage.getItem("DEBUG_matchedUserId"),
      DEBUG_matchedUserName: sessionStorage.getItem("DEBUG_matchedUserName"),
    });

    if (conversations.length > 0) {
      console.log("Available conversations details:");
      conversations.forEach((conv, index) => {
        console.log(`Conversation ${index}:`, {
          userId: conv.user._id,
          userName: conv.user.user_name || conv.user.username,
          matchId: conv.matchId,
          hasLastMessage: !!conv.lastMessage,
        });
      });
    }
  }, [conversations, matchId]);

  // Error handling
  if (error && error.includes("undefined")) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Lỗi dữ liệu
            </h2>
            <p className="text-gray-600 mb-4">
              Có lỗi xảy ra khi tải dữ liệu tin nhắn
            </p>
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
  }

  // Thêm useEffect để retry nếu conversations chưa load
  useEffect(() => {
    // Nếu có matchId nhưng chưa có conversations, đợi một chút rồi thử lại
    if (matchId && conversations.length === 0 && !loading) {
      console.log("No conversations yet, will retry in 1 second");
      const retryTimer = setTimeout(() => {
        console.log("Retrying conversation selection...");
        conversationSelectedRef.current = false; // Reset để cho phép retry
      }, 1000);

      return () => clearTimeout(retryTimer);
    }
  }, [matchId, conversations.length, loading]);

  return (
    <Layout>
      {/* Toast Notification for new messages */}
      {newMessageAlert && (
        <Toast
          message={newMessageAlert}
          type="info"
          onClose={() => setNewMessageAlert(null)}
        />
      )}

      <div className="h-full flex">
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
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages || []} // Ensure messages is never undefined
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
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
