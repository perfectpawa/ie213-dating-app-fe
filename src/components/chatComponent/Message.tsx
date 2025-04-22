interface MessageProps {
    isMyMessage: boolean;
    text: string;
    time: string;
    edited?: boolean;
}

export default function Message({ isMyMessage, text, time, edited }: MessageProps) {
    return (
        <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} my-2`}>
            <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${
                    isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
            >
                <p>{text}</p>
                <div className="text-xs text-gray-500 flex justify-between">
                    <span>{time}</span>
                    {edited && <span className="italic">Edited</span>}
                </div>
            </div>
        </div>
    );
}
