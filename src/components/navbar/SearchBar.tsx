import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
      <div className="max-w-lg w-full lg:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-[#4edcd8] focus:border-[#4edcd8] sm:text-sm"
            placeholder="Search"
            type="search"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 