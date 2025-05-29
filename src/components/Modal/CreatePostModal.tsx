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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState<'upload' | 'content'>('upload');
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
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
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;
        
        setCrop({
            unit: 'px',
            width: size,
            height: size,
            x,
            y
        });
    };

    const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;
        
        canvas.width = Math.floor(crop.width * scaleX);
        canvas.height = Math.floor(crop.height * scaleY);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                resolve(file);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !image || !imgRef.current || !completedCrop) return;

        try {
            setIsSubmitting(true);
            const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
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
        setCurrentStep('upload');
        setCompletedCrop(null);
        onClose();
    };

    const handleNextStep = () => {
        if (image) {
            setCurrentStep('content');
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep('upload');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        {currentStep === 'content' && (
                            <button
                                onClick={handlePreviousStep}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold text-white">
                            {currentStep === 'upload' ? 'Upload Image' : 'Write Content'}
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
                    ) : (
                        <div className="space-y-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Bạn đang nghĩ gì?"
                                className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />

                            {/* Image Preview with Crop UI */}
                            <div className="relative">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={1}
                                    minWidth={100}
                                    minHeight={100}
                                    keepSelection
                                    className="w-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-contain rounded-lg"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
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