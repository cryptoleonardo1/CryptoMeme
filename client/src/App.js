import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import ProjectHeader from './components/ProjectHeader/ProjectHeader';
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
      {/* Project Header - Highest z-index */}
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <ProjectHeader meme={currentMeme} />
        </div>
      </div>

      {/* Top Bar with Stats */}
      <div className="fixed top-[72px] left-0 right-0 z-[60]">
        <div className="w-full bg-[#1a1b1e] border-t border-[#2c2d31]">
          <TopBar
            meme={currentMeme}
            onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
            isDetailsOpen={isDetailsOpen}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 pt-[190px] pb-[60px]"> {/* Increased top padding */}
        <div className="h-full flex items-start justify-center">
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
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <Navigation />
      </div>

      {/* Details Page - Lower z-index than headers */}
      <DetailsPage
        isOpen={isDetailsOpen}
        meme={currentMeme}
      />
    </div>
  );
}

export default App;