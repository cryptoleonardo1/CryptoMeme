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

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1b1e] overflow-hidden"> {/* Add overflow-hidden */}
      <TopBar 
        meme={currentMeme} 
        onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
        isDetailsOpen={isDetailsOpen}
      />
   <div className="h-[calc(100vh-140px-64px)] flex items-center justify-center"> {/* Center meme */}
     <main className="w-full max-w-md px-4">
       <MemeStack 
         memes={dummyMemes} 
         onMemeChange={setCurrentMeme}
       />
     </main>
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