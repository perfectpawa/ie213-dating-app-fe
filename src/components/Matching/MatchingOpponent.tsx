const MatchingOpponent = () => {
  return (
    <div className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50">
      <div className="succsess-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px]">
        <div className="flex gap-2">
          <div
            className="p-1 rounded-lg bg-cover bg-center w-8 h-8 sm:w-10 sm:h-10"
            style={{ backgroundImage: `url()` }}
          ></div>
          <div>
            <p className="text-gray-900">Trần Lê Gia Bảo</p>
            <p className="text-gray-500">Em cho anh làm quen nhé!!!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchingOpponent;
