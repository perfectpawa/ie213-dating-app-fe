import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        {currentStep !== 'upload' && (
                            <button
                                onClick={handlePreviousStep}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold text-white">
                            {currentStep === 'upload' ? 'Upload Image' : 
                             currentStep === 'crop' ? 'Crop Image' : 'Write Content'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4">
                    {currentStep === 'upload' ? (
                        <div className="space-y-4">
                            {/* Image Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
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
                                            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                                        >
                                            <X size={20} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon size={48} className="text-gray-400" />
                                        <p className="text-gray-400">Click to upload an image</p>
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
                                    w-full px-6 py-2 rounded-full font-medium
                                    ${!image
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90'
                                    }
                                    flex items-center justify-center gap-2
                                `}
                            >
                                Next Step
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : currentStep === 'crop' ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    minWidth={100}
                                    minHeight={100}
                                    className="w-full"
                                    style={{ maxHeight: '400px' }}
                                >
                                    <img
                                        ref={imgRef}
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                                        onLoad={onImageLoad}
                                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                                    />
                                </ReactCrop>
                            </div>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!completedCrop}
                                className={`
                                    w-full px-6 py-2 rounded-full font-medium
                                    ${!completedCrop
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90'
                                    }
                                    flex items-center justify-center gap-2
                                `}
                            >
                                Next Step
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Bạn đang nghĩ gì?"
                                className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />

                            {/* Cropped Image Preview */}
                            <div className="relative">
                                <img
                                    src={croppedPreview}
                                    alt="Cropped Preview"
                                    className="w-full h-64 object-contain rounded-lg"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!content || !completedCrop || isSubmitting}
                                className={`
                                    w-full px-6 py-2 rounded-full font-medium
                                    ${(!content || !completedCrop || isSubmitting)
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90'
                                    }
                                    flex items-center justify-center gap-2
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Post'
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