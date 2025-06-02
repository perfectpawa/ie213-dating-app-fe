import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2, ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (content: string, image: File) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onCreatePost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [croppedPreview, setCroppedPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState<'upload' | 'crop' | 'content'>('upload');
    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        width: Math.min(90, 90),
        height: Math.min(90, 90),
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        
        // Tính toán kích thước crop ban đầu - nhỏ hơn nhiều so với kích thước ảnh
        // Giới hạn ở mức tối đa 300px cho chiều rộng và chiều cao ban đầu
        const maxInitialSize = 300;
        
        // Tính toán kích thước crop ban đầu, đảm bảo không quá lớn
        const initialWidth = Math.min(width * 0.5, maxInitialSize);
        const initialHeight = Math.min(height * 0.5, maxInitialSize);
        
        // Đặt vị trí crop ở chính giữa ảnh
        const initialX = (width - initialWidth) / 2;
        const initialY = (height - initialHeight) / 2;
        
        const initialCrop: Crop = {
            unit: 'px',
            width: initialWidth,
            height: initialHeight,
            x: initialX,
            y: initialY
        };
        
        setCrop(initialCrop);
        setCompletedCrop({
            unit: 'px',
            width: initialWidth,
            height: initialHeight,
            x: initialX,
            y: initialY
        });
    };

    const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        // Calculate the actual crop dimensions
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Calculate the crop dimensions while maintaining the selected aspect ratio
        const cropWidth = Math.floor(crop.width * scaleX);
        const cropHeight = Math.floor(crop.height * scaleY);

        // Set canvas dimensions to match the crop size exactly
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Enable image smoothing for better quality
        ctx.imageSmoothingQuality = 'high';
        ctx.imageSmoothingEnabled = true;

        // Draw the cropped image maintaining the exact crop dimensions
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                resolve(file);
            }, 'image/jpeg', 1.0);
        });
    };

    const generateCroppedPreview = async () => {
        if (!imgRef.current || !completedCrop) return;
        
        try {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppedPreview(reader.result as string);
            };
            reader.readAsDataURL(croppedFile);
        } catch (error) {
            console.error('Error generating preview:', error);
        }
    };

    const handleNextStep = async () => {
        if (currentStep === 'upload' && image) {
            setCurrentStep('crop');
        } else if (currentStep === 'crop' && completedCrop) {
            await generateCroppedPreview();
            setCurrentStep('content');
        }
    };

    const handlePreviousStep = () => {
        if (currentStep === 'content') {
            setCurrentStep('crop');
        } else if (currentStep === 'crop') {
            setCurrentStep('upload');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !image || !completedCrop) return;

        try {
            setIsSubmitting(true);
            let croppedImage: File;
            
            if (imgRef.current) {
                // If we have a valid image reference, use it for cropping
                croppedImage = await getCroppedImg(imgRef.current, completedCrop);
            } else {
                // If no image reference (user didn't change crop), use the original image
                croppedImage = image;
            }
            
            await onCreatePost(content, croppedImage);
            handleClose();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setImage(null);
        setImagePreview('');
        setCroppedPreview('');
        setCurrentStep('upload');
        setCompletedCrop(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700/50 z-10 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {currentStep !== 'upload' && (
                            <button
                                onClick={handlePreviousStep}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="text-[#4edcd8]">
                                <PlusCircle size={20} />
                            </span>
                            {currentStep === 'upload' ? 'Tải ảnh lên' : 
                             currentStep === 'crop' ? 'Cắt ảnh' : 'Tạo bài viết'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Thêm max-h và overflow-auto cho phần content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
                    {currentStep === 'upload' ? (
                        <div className="space-y-5">
                            {/* Image Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-700/50 rounded-lg p-8 text-center cursor-pointer hover:border-[#4edcd8]/50 transition-colors bg-gray-800/30 hover:bg-gray-800/50"
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImage(null);
                                                setImagePreview('');
                                            }}
                                            className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 hover:bg-black/90 transition-all shadow-lg"
                                        >
                                            <X size={16} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-10">
                                        <div className="bg-gray-700/50 rounded-full p-3">
                                            <ImageIcon size={32} className="text-[#4edcd8]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Kéo thả hoặc nhấp để tải ảnh lên</p>
                                            <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG (tối đa 10MB)</p>
                                        </div>
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

                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!image}
                                className={`
                                    w-full px-6 py-2.5 rounded-lg font-medium
                                    ${!image
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black hover:shadow-lg hover:shadow-[#4edcd8]/20'
                                    }
                                    flex items-center justify-center gap-2 transition-all
                                `}
                            >
                                Tiếp theo
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : currentStep === 'crop' ? (
                        <div className="space-y-5">
                            {/* Thêm các nút tỷ lệ khung hình */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-white">Tỷ lệ khung hình:</h3>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio(1)}
                                        className={`px-2 py-1 text-xs rounded ${
                                            aspectRatio === 1 
                                                ? 'bg-[#4edcd8] text-black' 
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        1:1
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio(4/3)}
                                        className={`px-2 py-1 text-xs rounded ${
                                            aspectRatio === 4/3 
                                                ? 'bg-[#4edcd8] text-black' 
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        4:3
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio(16/9)}
                                        className={`px-2 py-1 text-xs rounded ${
                                            aspectRatio === 16/9 
                                                ? 'bg-[#4edcd8] text-black' 
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        16:9
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio(undefined)}
                                        className={`px-2 py-1 text-xs rounded ${
                                            aspectRatio === undefined 
                                                ? 'bg-[#4edcd8] text-black' 
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        Tự do
                                    </button>
                                </div>
                            </div>
                                
                            <div className="relative bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 overflow-auto max-h-[400px]">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspectRatio}
                                    minWidth={50}
                                    minHeight={50}
                                    maxWidth={500}
                                    maxHeight={500}
                                    className="w-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-auto object-contain rounded-lg"
                                        onLoad={onImageLoad}
                                        style={{ maxHeight: '350px' }}
                                    />
                                </ReactCrop>
                            </div>
                                
                            {/* Thêm nút reset crop */}
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (imgRef.current) {
                                            const { width, height } = imgRef.current;
                                            const maxSize = 300;
                                            const initialWidth = Math.min(width * 0.5, maxSize);
                                            const initialHeight = Math.min(height * 0.5, maxSize);
                                            
                                            setCrop({
                                                unit: 'px',
                                                width: initialWidth,
                                                height: initialHeight,
                                                x: (width - initialWidth) / 2,
                                                y: (height - initialHeight) / 2
                                            });
                                        }
                                    }}
                                    className="px-4 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Khôi phục khung cắt
                                </button>
                            </div>

                            <p className="text-sm text-gray-400 text-center italic">
                                Kéo và điều chỉnh khung để cắt ảnh theo ý muốn
                            </p>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!completedCrop}
                                className={`
                                    w-full px-6 py-2.5 rounded-lg font-medium
                                    ${!completedCrop
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black hover:shadow-lg hover:shadow-[#4edcd8]/20'
                                    }
                                    flex items-center justify-center gap-2 transition-all
                                `}
                            >
                                Tiếp theo
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Nội dung bài viết
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Bạn đang nghĩ gì?"
                                    className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all h-28"
                                />
                            </div>

                            {/* Cropped Image Preview */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Xem trước
                                </label>
                                <div className="relative bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/30 flex items-center justify-center">
                                    <img
                                        src={croppedPreview}
                                        alt="Cropped Preview"
                                        className="w-full h-64 object-contain"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!content || !completedCrop || isSubmitting}
                                className={`
                                    w-full px-6 py-2.5 rounded-lg font-medium
                                    ${(!content || !completedCrop || isSubmitting)
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black hover:shadow-lg hover:shadow-[#4edcd8]/20'
                                    }
                                    flex items-center justify-center gap-2 transition-all
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    'Đăng bài'
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;