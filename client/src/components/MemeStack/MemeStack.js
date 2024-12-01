import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const MemeStack = ({ memes, onMemeChange }) => {
  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Test API connection on component mount
  React.useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/interactions/debug');
        const data = await response.json();
        console.log('API test response:', data);
      } catch (error) {
        console.error('API test error:', error);
      }
    };
    
    testAPI();
  }, []);

  // Function to update user points and meme stats
  const updateStats = async (action, memeId) => {
    try {
      console.log('Sending interaction:', { 
        action, 
        memeId,
        telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id 
      });
  
      const response = await fetch(`${API_BASE_URL}/api/interactions/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          memeId,
          telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'test123'
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to update stats');
      }
  
      const data = await response.json();
      console.log('Server response:', data);
  
      if (data.meme) {
        setCurrentMeme(prev => ({
          ...prev,
          engagement: {
            ...prev.engagement,
            likes: data.meme.likes,
            superLikes: data.meme.superLikes
          }
        }));
      }
  
      return data;
    } catch (error) {
      console.error('Error updating stats:', error);
      return null;
    }
  };
  

  // Function to select a random meme based on weight
  const getWeightedRandomMeme = () => {
    const totalWeight = memes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const meme of memes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        return {
          ...meme,
          engagement: meme.engagement || { likes: 0, superLikes: 0 }
        };
      }
    }
    
    return {
      ...memes[0],
      engagement: memes[0]?.engagement || { likes: 0, superLikes: 0 }
    };
  };

  // Initialize current and next memes
  React.useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/interactions/debug`);
        if (!response.ok) {
          throw new Error(`API test failed: ${response.status}`);
        }
        const data = await response.json();
        console.log('API test response:', data);
      } catch (error) {
        console.error('API test error:', error);
      }
    };
    
    testAPI();
  }, []);

  const handleSwipe = async (direction) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setLastSwipe(direction);
  
      console.log('Swipe direction:', direction);
      console.log('Current meme:', currentMeme);
  
      let action;
      switch (direction) {
        case 'right':
          action = 'like';
          break;
        case 'left':
          action = 'dislike';
          break;
        case 'super':
          action = 'superlike';
          break;
        default:
          action = 'view';
      }

      console.log('Attempting to update stats with action:', action);
      const result = await updateStats(action, currentMeme._id);
      console.log('Update result:', result);

      // Update backend with the interaction
      await updateStats(action, currentMeme._id);

      // Move to next meme and select new next meme
      setCurrentMeme(nextMeme);
      onMemeChange(nextMeme);
      setNextMeme(getWeightedRandomMeme());

      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 800);
    }
  };

  const indicatorVariants = {
    initial: {
      opacity: 0,
      scale: 0.5,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div 
              className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
                lastSwipe === 'right' ? 'bg-green-500/90' :
                lastSwipe === 'left' ? 'bg-red-500/90' :
                'bg-blue-500/90'
              }`}
              animate={{
                rotate: lastSwipe === 'right' ? 12 : lastSwipe === 'left' ? -12 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                scale: {
                  duration: 0.2,
                  times: [0, 0.5, 1]
                }
              }}
            >
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {lastSwipe === 'right' ? 'LIKE' : lastSwipe === 'left' ? 'NOPE' : 'SUPER'}
                </motion.span>
                <motion.span 
                  className="text-5xl"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {lastSwipe === 'right' ? '👍' : lastSwipe === 'left' ? '👎' : '⭐'}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <AnimatePresence>
        {currentMeme && (
          <motion.div
            key={currentMeme.id + "-current"}
            className="absolute inset-0 z-20"
            initial={{ scale: 0.95, y: 8, opacity: 0.8 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ 
              x: lastSwipe === 'right' ? 1000 : lastSwipe === 'left' ? -1000 : 0,
              y: lastSwipe === 'super' ? -1000 : 0,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 }
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <MemeCard
              meme={currentMeme}
              onSwipe={handleSwipe}
              isTop={true}
            />
          </motion.div>
        )}
        
        {nextMeme && (
          <motion.div
            key={nextMeme.id + "-next"}
            className="absolute inset-0 z-10"
            initial={{ scale: 0.95, y: 8 }}
            animate={{ scale: 0.95, y: 8 }}
          >
            <MemeCard
              meme={nextMeme}
              onSwipe={() => {}}
              isTop={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemeStack;