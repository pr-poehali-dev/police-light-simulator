import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Capacitor } from '@capacitor/core';
import { toggleFlashlight } from '@/utils/flashlight';
import { setMaxBrightness, restoreBrightness } from '@/utils/brightness';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentColor, setCurrentColor] = useState<'red' | 'blue'>('red');
  const intervalRef = useRef<number | null>(null);
  const isNative = Capacitor.isNativePlatform();
  const FLASH_INTERVAL = 400;

  useEffect(() => {
    if (isActive) {
      setMaxBrightness();
      
      intervalRef.current = window.setInterval(async () => {
        setCurrentColor(prev => prev === 'red' ? 'blue' : 'red');
        
        if (isNative) {
          await toggleFlashlight(true);
          setTimeout(() => toggleFlashlight(false), FLASH_INTERVAL / 2);
        }
      }, FLASH_INTERVAL);
    } else {
      restoreBrightness();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (isNative) {
        toggleFlashlight(false);
      }
    }

    return () => {
      restoreBrightness();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isNative) {
        toggleFlashlight(false);
      }
    };
  }, [isActive, isNative, FLASH_INTERVAL]);

  const getBackgroundColor = () => {
    if (!isActive) return 'bg-[#1A1F2C]';
    return currentColor === 'red' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]';
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`min-h-screen transition-colors duration-100 ${getBackgroundColor()} flex items-center justify-center`}>
      <Button
        size="lg"
        onClick={handleToggle}
        className={`w-64 h-64 rounded-full text-xl font-semibold transition-all duration-200 ${
          isActive 
            ? 'bg-white text-[#1A1F2C] hover:bg-white/90 shadow-2xl scale-105' 
            : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/30'
        }`}
      >
        {isActive ? (
          <div className="flex flex-col items-center gap-2">
            <Icon name="Square" size={64} />
            <span className="text-2xl">СТОП</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon name="Play" size={64} />
            <span className="text-2xl">СТАРТ</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default Index;
