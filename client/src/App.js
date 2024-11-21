import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import Navigation from './components/Navigation/Navigation';

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Set theme based on Telegram colors
    document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.backgroundColor);
    document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.textColor);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#FF3366]">CryptoMeme</h1>
        </header>
        <main className="mb-20">
          {/* MemeCard component will go here */}
        </main>
        <Navigation />
      </div>
    </div>
  );
}

export default App;