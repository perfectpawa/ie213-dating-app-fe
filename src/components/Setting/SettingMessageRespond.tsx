import { RiArrowDropDownLine } from "react-icons/ri";

const SettingMessageRespond = () => {

  return (
    <div className="bg-black text-white w-[706px] text-left">
      <h2 className="text-[20px] font-bold mb-6">
        Tin nhắn và lượt phản hồi tin
      </h2>
      <h3 className="font-bold text-[14px] mb-3">
        Cách mọi người có thể liên hệ với bạn
      </h3>
      <ul className="border border-gray-300 rounded-xl divide-y divide-gray-300 mb-8">
        <li className="flex justify-between items-center px-5 py-3 text-sm cursor-pointer">
          Kiểm soát tin nhắn
          <RiArrowDropDownLine className="text-gray-500 text-xl rotate-[-90deg]" />
        </li>
        <li className="flex justify-between items-center px-5 py-3 text-sm cursor-pointer">
          Lượt phản hồi tin
          <RiArrowDropDownLine className="text-gray-500 text-xl rotate-[-90deg]" />
        </li>
      </ul>
      <h3 className="text-[14px] font-bold mb-3">
        Ai có thể nhìn thấy khi bạn online
      </h3>
      <ul className="border border-gray-300 rounded-xl divide-y divide-gray-300">
        <li className="flex justify-between items-center px-5 py-3 text-sm cursor-pointer">
          Hiển thị trạng thái hoạt động
          <RiArrowDropDownLine className="text-gray-500 text-xl rotate-[-90deg]" />
        </li>
      </ul>
    </div>
  );
};
export default SettingMessageRespond;
