
import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Clear any theme from localStorage
    localStorage.removeItem('theme');
  }, []);

  return { 
    theme: 'light', 
    setTheme: () => {} // No-op function
  };
};
