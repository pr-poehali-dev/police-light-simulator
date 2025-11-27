import { ScreenBrightness } from '@capacitor-community/screen-brightness';

let originalBrightness: number | null = null;

export const setMaxBrightness = async () => {
  try {
    const { brightness } = await ScreenBrightness.getBrightness();
    originalBrightness = brightness;
    await ScreenBrightness.setBrightness({ brightness: 1 });
  } catch (error) {
    console.log('Brightness control not available:', error);
  }
};

export const restoreBrightness = async () => {
  if (originalBrightness !== null) {
    try {
      await ScreenBrightness.setBrightness({ brightness: originalBrightness });
      originalBrightness = null;
    } catch (error) {
      console.log('Failed to restore brightness:', error);
    }
  }
};
