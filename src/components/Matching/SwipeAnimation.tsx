import React, { useEffect, useState } from 'react';
import { Heart, X, Star } from 'lucide-react';

interface SwipeAnimationProps {
  action: 'like' | 'dislike' | 'superlike' | null;
  onComplete: () => void;
}

const SwipeAnimation: React.FC<SwipeAnimationProps> = ({ action, onComplete }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (action) {
      setVisible(true);
      
      // Hide the animation after a delay
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [action, onComplete]);
  
  if (!action || !visible) {
    return null;
  }
  
  const renderIcon = () => {
    switch (action) {
      case 'like':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-green-500 p-6 rounded-full animate-pulse relative">
              <Heart size={64} className="text-white" />
              <div className="absolute -top-2 -right-2 animate-ping">
                <Heart size={20} className="text-green-300" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-ping delay-100">
                <Heart size={16} className="text-green-300" />
              </div>
            </div>
            <div className="mt-4 font-bold text-xl text-green-500">
              CŨNG THÍCH RỒI ĐÓ NHA!
            </div>
          </div>
        );
      case 'dislike':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-red-500 p-6 rounded-full animate-pulse relative">
              <X size={64} className="text-white" />
              <div className="absolute -top-2 -right-2 animate-ping">
                <X size={20} className="text-red-300" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-ping delay-100">
                <X size={16} className="text-red-300" />
              </div>
            </div>
            <div className="mt-4 font-bold text-xl text-red-500">
              KHÔNG PHÙ HỢP LẮM!
            </div>
          </div>
        );
      case 'superlike':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 p-6 rounded-full animate-pulse relative">
              <Star size={64} className="text-white" />
              <div className="absolute -top-2 -right-2 animate-ping">
                <Star size={20} className="text-blue-300" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-ping delay-100">
                <Star size={16} className="text-blue-300" />
              </div>
            </div>
            <div className="mt-4 font-bold text-xl text-blue-500">
              SIÊU YÊU THÍCH LUÔN!
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 pointer-events-none animate-fadeIn">
      <div className="animate-scale">
        {renderIcon()}
      </div>
    </div>
  );
};

export default SwipeAnimation;
