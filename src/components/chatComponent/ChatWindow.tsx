import { useState } from "react";
import Message from "@/components/chatComponent/Message";
import ChatInput from "@/components/chatComponent/ChatInput";

interface ChatWindowProps {
    friend: string;
}

export default function ChatWindow({ friend }: ChatWindowProps) {
    const [messages, setMessages] = useState([
        { isMyMessage: true, text: "Hey, how are you?", time: "10:00 AM" },
        { isMyMessage: false, text: "I'm good, thanks! You?", time: "10:02 AM" },
        { isMyMessage: true, text: "Great to hear!", time: "10:05 AM", edited: true },
    ]);

    const sendMessage = (text: string) => {
        const newMessage = {
            isMyMessage: true,
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="text-lg font-bold border-b p-4">{friend}</div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <Message key={index} {...msg} />
                ))}
            </div>

            {/* Chat Input */}
            <ChatInput onSendMessage={sendMessage} />
        </div>
    );
}
