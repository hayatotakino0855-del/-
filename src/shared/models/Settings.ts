export interface TeleopSettings {
  version: string;
  font: {
    family: string;
    size: number;
    weight: 'normal' | 'bold';
  };
  colors: {
    text: string;
    background: string;
    backgroundOpacity: number;
  };
  animation: {
    speed: number;
    gap: number;
  };
  display: {
    height: number;
    alwaysOnTop: boolean;
  };
}

export function createDefaultSettings(): TeleopSettings {
  return {
    version: '1.0.0',
    font: {
      family: 'Arial',
      size: 24,
      weight: 'normal',
    },
    colors: {
      text: '#FFFFFF',
      background: '#000000',
      backgroundOpacity: 0.8,
    },
    animation: {
      speed: 100,
      gap: 50,
    },
    display: {
      height: 40,
      alwaysOnTop: true,
    },
  };
}
