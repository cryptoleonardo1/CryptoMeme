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
      WebApp.ready();
      WebApp.expand();
      
      try {
        await priceService.initializeData();
      } catch (error) {
        console.warn('Failed to load initial price data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeApp();
  }, []);

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
            <DetailsPage
              isOpen={isDetailsOpen}
              meme={currentMeme}
            />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1a1b1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
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