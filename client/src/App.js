// App.js
import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import MemeStack from './components/MemeStack/MemeStack';
import Navigation from './components/Navigation/Navigation';
import DetailsPage from './components/DetailsPage/DetailsPage';
import dummyMemes from './data/dummyMemes';

function App() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMeme, setCurrentMeme] = useState(dummyMemes[0]);

  const handleMemeChange = (meme) => {
    setCurrentMeme(meme);
  };

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1a1b1e] overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0">
        <TopBar
          meme={currentMeme}
          onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
          isDetailsOpen={isDetailsOpen}
        />
      </div>

      {/* Main Content - Fixed Position */}
      <div className="absolute inset-0 pt-[110px] pb-[60px]">
        <div className="h-full flex items-center justify-center">
          <div className="w-full px-4">
            <MemeStack
              memes={dummyMemes}
              onMemeChange={handleMemeChange}
              currentMeme={currentMeme}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0">
        <Navigation />
      </div>

      <DetailsPage
        isOpen={isDetailsOpen}
        meme={currentMeme}
      />
    </div>
  );
}

export default App;