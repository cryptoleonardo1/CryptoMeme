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
    <div className="min-h-screen bg-[#1a1b1e]">
      <TopBar
        meme={currentMeme}
        onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
        isDetailsOpen={isDetailsOpen}
      />
      
      {/* Main Content */}
      <div className="mt-[140px] mb-[80px]"> {/* Adjust mt value to move card down */}
        <MemeStack
          memes={dummyMemes}
          onMemeChange={setCurrentMeme}
        />
      </div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
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