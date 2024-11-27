// App.js
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

// Create separate LoadingScreen component
const LoadingScreen = () => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1a1b1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0',
      overflow: 'hidden'
    }}
  >
    {/* Image container */}
    <div style={{
      width: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0'
    }}>
      <img 
        src="/loading.png"
        alt="Loading"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '0',
          padding: '0'
        }}
      />
    </div>

    {/* Loading bar container */}
    <div style={{
      width: '100%',
      padding: '0 24px',
      marginBottom: '80px'
    }}>
      <div style={{
        width: '100%',
        height: '2px',
        backgroundColor: '#2c2d31',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div 
          className="animate-load-progress"
          style={{
            height: '100%',
            backgroundColor: '#22c55e'
          }}
        />
      </div>
      <p style={{
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '16px'
      }}>
        Loading market data...
      </p>
    </div>
  </div>
);

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
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
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