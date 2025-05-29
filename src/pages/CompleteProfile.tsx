import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import { authApi } from "../api/authApi";
import debounce from "lodash/debounce";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    user_name: user?.user_name || "",
    full_name: user?.full_name || "",
    gender: user?.gender || "",
    bio: user?.bio || "",
    birthday: user?.birthday || new Date().toISOString().split('T')[0],
    profile_picture: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile_picture || null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Debounced username validation
  const validateUsername = debounce(async (username: string) => {
    if (!username) {
      setUsernameError(null);
      return;
    }
    try {
      const response = await authApi.CheckUserNameValidation(username);
      if (response.data && !response.data.isValid) {
        setUsernameError("Tên người dùng này đã được sử dụng");
      } else {
        setUsernameError(null);
      }
    } catch (err) {
      setUsernameError("Không thể kiểm tra tên người dùng");
    }
  }, 500);

  useEffect(() => {
    validateUsername(formData.user_name);
    return () => {
      validateUsername.cancel();
    };
  }, [formData.user_name]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) {
      setError("Vui lòng chọn tên người dùng khác");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("user_name", formData.user_name);
      submitData.append("full_name", formData.full_name);
      submitData.append("gender", formData.gender);
      submitData.append("bio", formData.bio);
      submitData.append("birthday", formData.birthday);
      if (formData.profile_picture) {
        submitData.append("profile_picture", formData.profile_picture);
      }

      await completeProfile(submitData);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFormData(prev => ({
          ...prev,
          profile_picture: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Hoàn Thiện Hồ Sơ</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div 
              onClick={handleImageClick}
              className="w-32 h-32 rounded-full bg-gray-700 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Nhấp để tải ảnh lên</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Tên người dùng
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 bg-gray-700 border ${usernameError ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
            {usernameError && (
              <p className="mt-1 text-sm text-red-500">{usernameError}</p>
            )}
          </div>

          <div>            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
              <option value="prefer_not_to_say">Không muốn tiết lộ</option>
            </select>
          </div>

          <div>            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Tiểu sử
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Hãy kể về bản thân bạn..."
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-300 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang lưu..." : "Hoàn thiện hồ sơ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile; 