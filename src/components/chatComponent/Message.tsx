import avatarHolder from "../../assets/avatar_holder.png";

interface MessageProps {
    isMyMessage: boolean;
    text: string;
    time: string;
    edited?: boolean;
    senderName?: string | null;
    senderImage?: string | null;
}

export default function Message({ isMyMessage, text, time, edited, senderName, senderImage }: MessageProps) {
    return (
        <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} my-2`}>
            {!isMyMessage && senderImage && (
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img
                        src={senderImage}
                        alt={senderName || "User"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = avatarHolder;
                        }}
                    />
                </div>
            )}
            <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${
                    isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
            >
                {/* {!isMyMessage && senderName && (
                    <p className="font-semibold text-xs mb-1">{senderName}</p>
                )} */}
                <p className="text-left">{text}</p>
                <div className="text-left text-xs text-gray-500 flex justify-between">
                    <span>{time}</span>
                    {edited && <span className="italic">Edited</span>}
                </div>
            </div>
        </div>
    );
}
