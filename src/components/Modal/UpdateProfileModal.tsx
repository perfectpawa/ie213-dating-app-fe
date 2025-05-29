import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { User } from '../../types/user';
import { userApi } from '../../api/userApi';

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdate: (updatedUser: User) => void;
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

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Cập nhật thông tin</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Tiểu sử
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Giới tính
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                px-6 py-2 rounded-full font-medium
                                ${loading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90'
                                }
                                flex items-center gap-2
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