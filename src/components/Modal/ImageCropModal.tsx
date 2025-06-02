import React, { useState, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: File) => Promise<void>;
  aspectRatio?: number;
  imageFile: File | null;
  title: string;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio,
  imageFile,
  title,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    if (aspectRatio) {
      // Calculate dimensions that maintain aspect ratio
      let cropWidth, cropHeight;
      
      if (width / height > aspectRatio) {
        // Image is wider than target aspect ratio
        cropHeight = height;
        cropWidth = height * aspectRatio;
      } else {
        // Image is taller than target aspect ratio
        cropWidth = width;
        cropHeight = width / aspectRatio;
      }

      // Center the crop
      const x = (width - cropWidth) / 2;
      const y = (height - cropHeight) / 2;

      setCrop({
        unit: 'px',
        width: cropWidth,
        height: cropHeight,
        x,
        y,
      });

      // Set initial completed crop
      setCompletedCrop({
        unit: 'px',
        width: cropWidth,
        height: cropHeight,
        x,
        y,
      });
    } else {
      // No aspect ratio - use 90% of the image
      const cropSize = Math.min(width, height) * 0.9;
      const x = (width - cropSize) / 2;
      const y = (height - cropSize) / 2;

      setCrop({
        unit: 'px',
        width: cropSize,
        height: cropSize,
        x,
        y,
      });

      // Set initial completed crop
      setCompletedCrop({
        unit: 'px',
        width: cropSize,
        height: cropSize,
        x,
        y,
      });
    }
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsSubmitting(true);
    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.95);
      });

      // Create a File object from the blob
      const croppedFile = new File([blob], imageFile?.name || 'cropped-image.jpg', {
        type: 'image/jpeg',
      });

      await onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative w-full aspect-square max-h-[500px] bg-gray-700 rounded-lg overflow-hidden">
            {imagePreview && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-h-[500px]"
              >
                <img
                  ref={imgRef}
                  src={imagePreview}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[500px] object-contain"
                />
              </ReactCrop>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              disabled={isSubmitting || !completedCrop}
              className="px-4 py-2 bg-[#4edcd8] text-white rounded-lg hover:bg-[#3bc9c5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>Cắt & Lưu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal; 