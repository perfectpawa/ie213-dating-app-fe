interface Friend {
    id: number;
    name: string;
    status: "Online" | "Offline" | "Away";
    lastMessage: string;
    timestamp: string;
}

interface FriendListProps {
    onSelectFriend: (friend: string) => void;
}

const friends: Friend[] = [
    { id: 1, name: "Alice Johnson", status: "Online", lastMessage: "See you later!", timestamp: "10:30 AM" },
    { id: 2, name: "Bob Williams", status: "Offline", lastMessage: "Haha, that's funny!", timestamp: "Yesterday" },
    { id: 3, name: "Charlie Smith", status: "Online", lastMessage: "Let's meet at 5 PM.", timestamp: "8:15 AM" },
    { id: 4, name: "Diana Roberts", status: "Away", lastMessage: "I’ll text you later.", timestamp: "Monday" },
    { id: 5, name: "Emma Watson", status: "Online", lastMessage: "Did you finish the project?", timestamp: "9:45 AM" },
    { id: 6, name: "Frank Miller", status: "Offline", lastMessage: "I'll call you later.", timestamp: "Sunday" },
    { id: 7, name: "Grace Lee", status: "Away", lastMessage: "Busy right now, talk later.", timestamp: "Saturday" },
    { id: 8, name: "Henry Brown", status: "Online", lastMessage: "Good morning!", timestamp: "7:30 AM" },
    { id: 9, name: "Ivy Green", status: "Offline", lastMessage: "See you tomorrow!", timestamp: "Friday" },
    { id: 10, name: "Jack White", status: "Away", lastMessage: "On my way.", timestamp: "Thursday" },
    { id: 11, name: "Kathy Blue", status: "Online", lastMessage: "Let's grab lunch.", timestamp: "Wednesday" },
    { id: 12, name: "Leo King", status: "Offline", lastMessage: "Can't talk right now.", timestamp: "Tuesday" },
    { id: 13, name: "Mia Red", status: "Away", lastMessage: "Out of the office.", timestamp: "Monday" },
    { id: 14, name: "Nina Black", status: "Online", lastMessage: "Ready for the meeting?", timestamp: "Sunday" },
    { id: 15, name: "Oscar Gray", status: "Offline", lastMessage: "I'll be back soon.", timestamp: "Saturday" },
];

export default function FriendList({ onSelectFriend }: FriendListProps) {

    return (
        <div className="flex flex-col h-full bg-white">
            <ul className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                {friends.map((friend) => (
                    <li
                        key={friend.id}
                        onClick={() => onSelectFriend(friend.name)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 border-b"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
                                {friend.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">{friend.name}</p>
                                <p className="text-sm text-gray-600">{friend.lastMessage}</p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">{friend.timestamp}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
