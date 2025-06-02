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
        // Set initial crop to match full image dimensions
        const fullCrop: Crop = {
            unit: 'px',
            width: width,
            height: height,
            x: 0,
            y: 0
        };
        setCrop(fullCrop);
        setCompletedCrop({
            unit: 'px',
            width: width,
            height: height,
            x: 0,
            y: 0
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700/50">
                {/* Header */}
                <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50">
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

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                            <div className="relative bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    minWidth={100}
                                    minHeight={100}
                                    className="w-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
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