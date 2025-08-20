import { useTheme } from '../context/ThemeContext';
import { lightColors, darkColors, AppColors } from './colors';

export const useAppTheme = () => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  const colors: AppColors = isDark ? darkColors : lightColors;
  
  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    colors,
    lightColors,
    darkColors,
  };
};
