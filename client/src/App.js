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
      {/* Project Header - Now at the top */}
      <div className="absolute top-0 left-0 right-0 z-[60] bg-[#1a1b1e] pt-4 pb-2">
        <ProjectHeader meme={currentMeme} />
      </div>

      {/* TopBar - Now below ProjectHeader */}
      <div className="absolute left-0 right-0 z-50" style={{ top: '80px' }}>
        <TopBar
          meme={currentMeme}
          onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
          isDetailsOpen={isDetailsOpen}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 pt-[160px] pb-[60px]">
        <div className="h-full flex flex-col">
          {/* Meme Card */}
          <div className="flex-1 flex items-start justify-center">
            <div className="w-full px-4">
              <MemeStack
                memes={dummyMemes}
                onMemeChange={handleMemeChange}
                currentMeme={currentMeme}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-[60]">
        <Navigation />
      </div>

      {/* Details Page */}
      <DetailsPage
        isOpen={isDetailsOpen}
        meme={currentMeme}
      />
    </div>
  );
}

export default App;