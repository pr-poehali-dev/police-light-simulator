import { Capacitor } from '@capacitor/core';

let isFlashlightOn = false;

export const toggleFlashlight = async (enable: boolean): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Flashlight only works on native platforms');
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    const track = stream.getVideoTracks()[0];
    const imageCapture = new (window as any).ImageCapture(track);
    const photoCapabilities = await imageCapture.getPhotoCapabilities();

    if (photoCapabilities.fillLightMode && photoCapabilities.fillLightMode.includes('flash')) {
      await track.applyConstraints({
        advanced: [{ torch: enable } as any]
      });
      isFlashlightOn = enable;
      return true;
    }

    track.stop();
    return false;
  } catch (error) {
    console.error('Flashlight error:', error);
    return false;
  }
};

export const getFlashlightStatus = (): boolean => {
  return isFlashlightOn;
};
