import React from 'react';

const ProjectHeader = ({ meme }) => {
  return (
    <div className="fixed top-[72px] left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <img 
            src={meme?.logo} 
            alt={meme?.projectName}
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-2xl font-bold text-white">
            {meme?.projectName}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;