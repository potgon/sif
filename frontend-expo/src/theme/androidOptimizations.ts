import { Platform } from 'react-native';

// Android-specific theme optimizations
export const androidThemeOptimizations = {
  // Touch feedback optimizations
  touchFeedback: {
    activeOpacity: Platform.OS === 'android' ? 0.6 : 0.7,
    rippleColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.1)' : undefined,
  },
  
  // Shadow and elevation
  shadows: Platform.OS === 'android' ? {
    // Android uses elevation instead of shadows
    elevation: 4,
    shadowColor: undefined,
    shadowOffset: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
  } : {
    // iOS shadows
    elevation: undefined,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Modal positioning
  modal: {
    statusBarTranslucent: Platform.OS === 'android',
    marginTop: Platform.OS === 'android' ? 50 : 0,
  },
  
  // Chart optimizations
  chart: {
    useShadowColorFromDataset: Platform.OS === 'android' ? false : true,
    labelFontSize: Platform.OS === 'android' ? 10 : 12,
    labelFontWeight: Platform.OS === 'android' ? '500' : '400',
  },
  
  // Keyboard handling
  keyboard: {
    behavior: Platform.OS === 'android' ? 'height' : 'padding',
    nestedScrollEnabled: Platform.OS === 'android',
  },
};

// Helper function to apply Android optimizations
export const applyAndroidOptimizations = (baseStyles: any, androidOverrides: any) => {
  if (Platform.OS === 'android') {
    return { ...baseStyles, ...androidOverrides };
  }
  return baseStyles;
};
