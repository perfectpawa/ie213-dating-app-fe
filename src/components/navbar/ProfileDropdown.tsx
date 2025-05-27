import React from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import avatarPlaceholder from '../../assets/avatar_holder.png';

interface ProfileDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ProfileDropdown = ({ isOpen, onToggle }: ProfileDropdownProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={user?.profile_picture || avatarPlaceholder}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <ChevronDown className="h-5 w-5 text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute z-40 right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 