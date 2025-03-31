import {useEffect, useState} from "react";
import ChatWindow from "@/components/chatComponent/ChatWindow";
import FriendList from "@/components/chatComponent/FriendList";

export default function Chat() {
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

    useEffect(() => {
        console.log(selectedFriend);
    })

    return (
        <div className="flex flex-row h-screen w-screen">
            <div className="border-r flex-1 flex-col bg-gray-100">
                <FriendList onSelectFriend={setSelectedFriend} />
            </div>
            <div />
            <div className="flex-2 flex-col h-screen">
                {selectedFriend ? (
                    <ChatWindow friend={selectedFriend} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a chat
                    </div>
                )}
            </div>
            <div />
        </div>
    );
}