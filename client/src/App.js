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

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1b1e] relative">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar
          meme={currentMeme}
          onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
          isDetailsOpen={isDetailsOpen}
        />
      </div>

      {/* Main Content */}
      <div className="pt-[100px] pb-[64px]"> {/* Increased top padding by 20px */}
        <div className="max-w-md mx-auto px-4 h-[calc(100vh-164px)] flex items-center justify-center">
          <MemeStack
            memes={dummyMemes}
            onMemeChange={setCurrentMeme}
          />
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
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