const sampleData = {
    name: {
        first: "Đỗ",
        last: "Nguyễn Thiên Phúc",
    },
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9TvKGErN3r8IfUD2WEgki0-mUPNkYUhxXw&s",
    quote: "Khi bạn thực sự mong muốn điều gì thì cả vũ trụ sẽ chung sức giúp bạn.",
}
//TODO: replace with real data passed from props
const MatchingCard = () => {
    return (
    <div
        className="flex basis-[calc(25%-0.375rem)]
          rounded-2xl
          group duration-500
          cursor-pointer
          overflow-hidden
          text-gray-50
          hover:duration-700 relative"
    >

    <img
        src={sampleData.avatar}
        alt="Avatar"
        className="w-full h-full object-cover group-hover:scale-110 duration-500"
    />

      <div className="absolute bottom-0 bg-gray-50
        w-full p-4
        flex flex-col gap-2
        group-hover:translate-y-0
        group-hover:duration-600
        translate-y-[calc(50%)] duration-500"
      >
        <span className="text-gray-900 font-bold text-xm">
            {sampleData.name.first} {sampleData.name.last}
        </span>
        <span className="text-gray-800 font-bold text-xm">Sinh viên</span>
        <p className="text-neutral-800">
            {sampleData.quote}
        </p>
      </div>
    </div>
  );
};

export default MatchingCard;
