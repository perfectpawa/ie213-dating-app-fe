import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import { authApi } from "../api/authApi";
import debounce from "lodash/debounce";
import ParticlesBackground from "../components/layout/ParticlesBackground";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ValidationErrors {
  user_name?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  birthday?: string;
}

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    user_name: user?.user_name || "",
    full_name: user?.full_name || "",
    gender: user?.gender || "",
    bio: user?.bio || "",
    birthday: user?.birthday || "",
    profile_picture: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile_picture || null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [date, setDate] = useState<Date | undefined>(
    formData.birthday ? new Date(formData.birthday) : undefined
  );

  const validateField = (name: string, value: string | null) => {
    let error = "";
    if (value === null) {
      error = "Trường này không được để trống";
      return error;
    }
    
    switch (name) {
      case "user_name":
        if (!value) {
          error = "Tên người dùng không được để trống";
        } else if (value.length < 3) {
          error = "Tên người dùng phải có ít nhất 3 ký tự";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới";
        }
        break;
      case "full_name":
        if (!value) {
          error = "Họ và tên không được để trống";
        } else if (value.length < 2) {
          error = "Họ và tên phải có ít nhất 2 ký tự";
        } else if (!/^[\p{L}\s]+$/u.test(value)) {
          error = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
        }
        break;
      case "gender":
        if (!value) {
          error = "Vui lòng chọn giới tính";
        }
        break;
      case "bio":
        if (value && value.length > 500) {
          error = "Tiểu sử không được vượt quá 500 ký tự";
        }
        break;
      case "birthday":
        if (!value) {
          error = "Vui lòng chọn ngày sinh";
        } else {
          // Parse dd/mm/yyyy format
          const [day, month, year] = value.split('/').map(Number);
          const birthDate = new Date(year, month - 1, day);
          const today = new Date();
          const minDate = new Date();
          const maxDate = new Date();
          
          minDate.setFullYear(today.getFullYear() - 100);
          maxDate.setFullYear(today.getFullYear() - 18);
          
          if (isNaN(birthDate.getTime())) {
            error = "Ngày sinh không hợp lệ";
          } else if (birthDate > today) {
            error = "Ngày sinh không thể là ngày trong tương lai";
          } else if (birthDate < minDate) {
            error = "Ngày sinh không hợp lệ (tuổi tối đa là 100)";
          } else if (birthDate > maxDate) {
            error = "Bạn phải đủ 18 tuổi để sử dụng dịch vụ";
          }
        }
        break;
    }
    return error;
  };

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
      console.error(err);
    }
  }, 500);

  useEffect(() => {
    validateUsername(formData.user_name);
    return () => {
      validateUsername.cancel();
    };
  }, [formData.user_name]);

  // Update formData when date changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setFormData(prev => ({
        ...prev,
        birthday: formattedDate
      }));
      const error = validateField('birthday', formattedDate);
      setValidationErrors(prev => ({
        ...prev,
        birthday: error
      }));
    }
  }, [date]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'profile_picture') {
        const value = formData[key as keyof typeof formData];
        if (typeof value === 'string') {
          const error = validateField(key, value);
          if (error) errors[key as keyof ValidationErrors] = error;
        }
      }
    });

    if (Object.keys(errors).length > 0 || usernameError) {
      setValidationErrors(errors);
      setError("Vui lòng kiểm tra lại thông tin");
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
      // Convert dd/mm/yyyy to yyyy-mm-dd for API
      const [day, month, year] = formData.birthday.split('/');
      const apiDate = `${year}-${month}-${day}`;
      submitData.append("birthday", apiDate);
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
    setTouched(prev => ({ ...prev, [name]: true }));

    console.log(touched)
    
    // Validate the field
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
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

  const inputClasses = (fieldName: string) => {
    const baseClasses = "w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200";
    const errorClasses = validationErrors[fieldName as keyof ValidationErrors] ? 'border-red-500' : 'border-gray-600';
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ParticlesBackground />
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Hoàn Thiện Hồ Sơ</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={handleImageClick}
              className="w-40 h-40 rounded-full bg-gray-700 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-90 transition-all duration-200 border-2 border-gray-600 hover:border-teal-500"
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-400 text-sm">Nhấp để tải ảnh lên</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-gray-400 text-sm mt-2">Kích thước tối đa: 5MB</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Tên người dùng
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={inputClasses('user_name')}
              placeholder="Nhập tên người dùng của bạn"
            />
            {(validationErrors.user_name || usernameError) && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.user_name || usernameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
              Họ và tên
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={inputClasses('full_name')}
              placeholder="Nhập họ và tên của bạn"
            />
            {validationErrors.full_name && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.full_name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={inputClasses('gender')}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
                <option value="prefer_not_to_say">Không muốn tiết lộ</option>
              </select>
              {validationErrors.gender && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.gender}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-300">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and forward slashes
                    if (/^[0-9/]*$/.test(value)) {
                      // Format as dd/mm/yyyy while typing
                      let formatted = value.replace(/\D/g, '');
                      if (formatted.length > 0) {
                        if (formatted.length <= 2) {
                          // formatted = formatted;
                        } else if (formatted.length <= 4) {
                          formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                        } else {
                          formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
                        }
                      }
                      setFormData(prev => ({
                        ...prev,
                        birthday: formatted
                      }));
                      
                      // Try to parse the date
                      if (formatted.length === 10) {
                        const [day, month, year] = formatted.split('/').map(Number);
                        const newDate = new Date(year, month - 1, day);
                        if (!isNaN(newDate.getTime())) {
                          setDate(newDate);
                        }
                      }
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="dd/mm/yyyy"
                  className={cn(
                    "w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 pr-10",
                    validationErrors.birthday ? "border-red-500" : "border-gray-600"
                  )}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-400 transition-colors"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border border-teal-500/20 shadow-lg" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setFormData(prev => ({
                            ...prev,
                            birthday: format(newDate, "dd/MM/yyyy")
                          }));
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        const minDate = new Date();
                        const maxDate = new Date();
                        
                        minDate.setFullYear(today.getFullYear() - 100);
                        maxDate.setFullYear(today.getFullYear() - 18);
                        
                        return date > today || date < minDate || date > maxDate;
                      }}
                      initialFocus
                      className="rounded-md border border-gray-700 bg-gray-800 text-white"
                      classNames={{
                        months: "flex flex-col sm:flex-row gap-2",
                        month: "flex flex-col gap-4",
                        caption: "flex justify-center pt-1 relative items-center w-full text-white",
                        caption_label: "text-sm font-medium",
                        nav: "flex items-center gap-1",
                        nav_button: cn(
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded-md",
                          "border border-gray-600"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-x-1",
                        head_row: "flex",
                        head_cell: "text-gray-400 rounded-md w-8 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: cn(
                          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                          "hover:bg-gray-700 rounded-md transition-colors"
                        ),
                        day: cn(
                          "h-8 w-8 p-0 font-normal text-white hover:bg-gray-700 rounded-md transition-colors",
                          "focus:bg-teal-500 focus:text-white focus:rounded-md"
                        ),
                        day_selected: "bg-teal-500 text-white hover:bg-teal-600 hover:text-white focus:bg-teal-500 focus:text-white",
                        day_today: "bg-gray-700 text-white",
                        day_outside: "text-gray-500 opacity-50",
                        day_disabled: "text-gray-500 opacity-50 cursor-not-allowed",
                        day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {validationErrors.birthday && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.birthday}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Tiểu sử
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={inputClasses('bio')}
              placeholder="Hãy kể về bản thân bạn..."
            />
            {validationErrors.bio && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.bio}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              "Hoàn thiện hồ sơ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile; 