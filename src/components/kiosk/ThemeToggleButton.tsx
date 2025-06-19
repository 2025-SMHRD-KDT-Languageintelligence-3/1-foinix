"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default to light, will be updated by useEffect

  useEffect(() => {
    // This effect runs only on the client after hydration
    const storedTheme = localStorage.getItem('kiosk-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme: 'light' | 'dark';
    if (storedTheme === 'dark' || storedTheme === 'light') {
      initialTheme = storedTheme;
    } else {
      initialTheme = systemPrefersDark ? 'dark' : 'light';
    }
    setTheme(initialTheme); // Set state based on localStorage or system preference
  }, []);


  useEffect(() => {
    // This effect applies the theme class and updates localStorage when theme state changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Only update localStorage if we are on the client and theme has been initialized
    if (typeof window !== 'undefined') {
        localStorage.setItem('kiosk-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Avoid rendering interactive part on server or before hydration to prevent mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Return a placeholder or null to avoid rendering the button prematurely
    // This helps prevent hydration errors if the server-rendered output differs
    return <div style={{ width: '80px', height: '80px' }} />;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-20 h-20 shadow-md 
                 border 
                 bg-[hsl(220,30%,10%)] text-[hsl(220,15%,85%)] border-[hsl(220,30%,25%)] 
                 hover:bg-[hsl(220,30%,15%)] 
                 dark:bg-white dark:text-[hsl(220,30%,10%)] dark:border-gray-300 
                 dark:hover:bg-gray-200"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon className="!size-8" /> : <Sun className="!size-8" />}
    </Button>
  );
}
