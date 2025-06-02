import React, { useState } from 'react';
import { X, Loader2, User, FileText, Calendar, Users } from 'lucide-react';
import { User as UserType } from '../../types/user';
import { userApi } from '../../api/userApi';

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onUpdate: (updatedUser: UserType) => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
    isOpen,
    onClose,
    user,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        bio: user.bio || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await userApi.updateProfile(formData);
            if (response.data?.data?.user) {
                onUpdate(response.data.data.user);
                handleClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            full_name: user.full_name || '',
            bio: user.bio || '',
            gender: user.gender || '',
            birthday: user.birthday || '',
        });
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    const bioLength = formData.bio.length;
    const maxBioLength = 150;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700/50">
                {/* Header */}
                <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="text-[#4edcd8]">
                            <User size={20} />
                        </span>
                        Cập nhật thông tin
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile overview */}
                <div className="bg-gray-800/30 p-4 border-b border-gray-700/50">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#4edcd8]/70 shadow-lg shadow-[#4edcd8]/10">
                            <img 
                                src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.user_name}&background=1a3f3e&color=4edcd8`} 
                                alt={user.user_name || "User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{user.user_name}</h3>
                            <p className="text-gray-400 text-left text-sm">@{user.user_name?.toLowerCase().replace(/\s+/g, '_')}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <span className="rounded-full bg-red-500/20 p-1">
                                <X size={14} className="text-red-400" />
                            </span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                            <User size={16} className="text-[#4edcd8]" />
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all"
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <FileText size={16} className="text-[#4edcd8]" />
                                Tiểu sử
                            </label>
                            <span className={`text-xs ${bioLength > maxBioLength ? 'text-red-400' : 'text-gray-500'}`}>
                                {bioLength}/{maxBioLength}
                            </span>
                        </div>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            maxLength={maxBioLength}
                            className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all"
                            placeholder="Viết gì đó về bản thân..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                                <Users size={16} className="text-[#4edcd8]" />
                                Giới tính
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all appearance-none"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                                <Calendar size={16} className="text-[#4edcd8]" />
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                px-6 py-2.5 rounded-lg font-medium
                                ${loading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-white hover:shadow-lg hover:shadow-[#4edcd8]/20'
                                }
                                flex items-center gap-2 transition-all
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập nhật'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;