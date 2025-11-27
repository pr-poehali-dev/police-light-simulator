import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Capacitor } from '@capacitor/core';
import { toggleFlashlight } from '@/utils/flashlight';

type FlashlightColor = 'red' | 'blue' | 'alternate';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [color, setColor] = useState<FlashlightColor>('alternate');
  const [speed, setSpeed] = useState([5]);
  const [currentColor, setCurrentColor] = useState<'red' | 'blue'>('red');
  const [useRealFlash, setUseRealFlash] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isActive) {
      const interval = 1000 / speed[0];
      
      intervalRef.current = window.setInterval(async () => {
        if (color === 'alternate') {
          setCurrentColor(prev => prev === 'red' ? 'blue' : 'red');
        }
        
        if (useRealFlash && isNative) {
          await toggleFlashlight(true);
          setTimeout(() => toggleFlashlight(false), interval / 2);
        }
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (useRealFlash && isNative) {
        toggleFlashlight(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (useRealFlash && isNative) {
        toggleFlashlight(false);
      }
    };
  }, [isActive, speed, color, useRealFlash, isNative]);

  const getBackgroundColor = () => {
    if (!isActive) return 'bg-[#1A1F2C]';
    
    if (color === 'red') return 'bg-[#EF4444]';
    if (color === 'blue') return 'bg-[#3B82F6]';
    
    return currentColor === 'red' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]';
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`min-h-screen transition-colors duration-100 ${getBackgroundColor()} flex flex-col items-center justify-center p-6`}>
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Мигалка</h1>
          <p className="text-white/70 text-sm">Полицейская световая сигнализация</p>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleToggle}
            className={`w-48 h-48 rounded-full text-xl font-semibold transition-all duration-200 ${
              isActive 
                ? 'bg-white text-[#1A1F2C] hover:bg-white/90 shadow-2xl scale-105' 
                : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/30'
            }`}
          >
            {isActive ? (
              <div className="flex flex-col items-center gap-2">
                <Icon name="Square" size={48} />
                <span>СТОП</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Icon name="Play" size={48} />
                <span>СТАРТ</span>
              </div>
            )}
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 space-y-6">
          
          {isNative && (
            <div className="space-y-3">
              <label className="text-white font-medium text-sm flex items-center gap-2">
                <Icon name="Flashlight" size={18} />
                Использовать вспышку
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant={!useRealFlash ? 'default' : 'outline'}
                  onClick={() => setUseRealFlash(false)}
                  className={`flex-1 ${
                    !useRealFlash 
                      ? 'bg-white text-[#1A1F2C] hover:bg-white/90' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/30'
                  }`}
                >
                  Экран
                </Button>
                <Button
                  variant={useRealFlash ? 'default' : 'outline'}
                  onClick={() => setUseRealFlash(true)}
                  className={`flex-1 ${
                    useRealFlash 
                      ? 'bg-white text-[#1A1F2C] hover:bg-white/90' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/30'
                  }`}
                >
                  Фонарик
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-white font-medium text-sm flex items-center gap-2">
              <Icon name="Palette" size={18} />
              Цвет мигалки
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={color === 'red' ? 'default' : 'outline'}
                onClick={() => setColor('red')}
                className={`${
                  color === 'red' 
                    ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white border-0' 
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/30'
                }`}
              >
                Красный
              </Button>
              <Button
                variant={color === 'blue' ? 'default' : 'outline'}
                onClick={() => setColor('blue')}
                className={`${
                  color === 'blue' 
                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white border-0' 
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/30'
                }`}
              >
                Синий
              </Button>
              <Button
                variant={color === 'alternate' ? 'default' : 'outline'}
                onClick={() => setColor('alternate')}
                className={`${
                  color === 'alternate' 
                    ? 'bg-gradient-to-r from-[#EF4444] to-[#3B82F6] hover:opacity-90 text-white border-0' 
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/30'
                }`}
              >
                Оба
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon name="Zap" size={18} />
                Скорость
              </span>
              <span className="text-white/70 text-xs">{speed[0]} миг/сек</span>
            </label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={1}
              max={20}
              step={1}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white/30"
            />
            <div className="flex justify-between text-xs text-white/50">
              <span>Медленно</span>
              <span>Быстро</span>
            </div>
          </div>

        </Card>

        <div className="text-center">
          <p className="text-white/40 text-xs">
            Используйте с осторожностью. Не направляйте на людей и водителей.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Index;