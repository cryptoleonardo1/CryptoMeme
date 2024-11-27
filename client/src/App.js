import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import ProjectHeader from './components/ProjectHeader/ProjectHeader';
import MemeStack from './components/MemeStack/MemeStack';
import Navigation from './components/Navigation/Navigation';
import DetailsPage from './components/DetailsPage/DetailsPage';
import TasksPage from './components/TasksPage';
import ProfilePage from './components/ProfilePage';
import RanksPage from './components/RanksPage';
import dummyMemes from './data/dummyMemes';
import { priceService } from './services/priceService';

// Loading Screen Component (included in App.js for simplicity)
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col items-center justify-center">
      {/* Custom loading image */}
      <div className="mb-8">
        <img 
          src="/loading.png" 
          alt="Loading"
          className="w-[200px] h-[200px] object-contain animate-pulse"
          draggable="false"
        />
      </div>
      
      {/* Progress bar and text */}
      <div className="text-center px-4">
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-load-progress" />
        </div>
        <p className="text-gray-400 mt-4">Loading market data...</p>
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('memes');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMeme, setCurrentMeme] = useState(dummyMemes[0]);

  const handleMemeChange = (meme) => {
    setCurrentMeme(meme);
  };

  useEffect(() => {
    async function initializeApp() {
      try {
        WebApp.ready();
        WebApp.expand();
        await priceService.initializeData();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        // Add small delay to ensure image is loaded
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    initializeApp();
  }, []);

  if (isLoading) {
    // Force full viewport dimensions during loading
    return (
      <div className="loading-screen-container">
        <LoadingScreen />
      </div>
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksPage />;
      case 'ranks':
        return <RanksPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <>
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
            <div className="absolute inset-0 pt-[190px] pb-[60px]">
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

            {/* Details Page */}
            <DetailsPage isOpen={isDetailsOpen} meme={currentMeme} />
          </>
        );
    }
  };

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 bg-[#1a1b1e] overflow-hidden">
      {renderContent()}
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;