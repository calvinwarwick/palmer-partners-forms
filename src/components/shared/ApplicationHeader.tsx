
import React from 'react';

interface ApplicationHeaderProps {
  title?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ 
  title
}) => {
  return (
    <div className="bg-dark-grey w-full overflow-hidden">
      <div className="w-full px-6 py-6 relative h-20 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="transform rotate-12 -my-2">
              <img 
                src="/lovable-uploads/fb64eebc-b467-4dd1-b635-6d1817b04c67.png" 
                alt="Palmer & Partners P Logo" 
                className="h-20 w-20"
              />
            </div>
            <div className="flex flex-col items-start">
              <img 
                src="/lovable-uploads/8958574e-86f0-4482-9a99-322142a0f734.png" 
                alt="Palmer & Partners Text Logo" 
                className="h-12"
              />
            </div>
          </div>
          {title && (
            <div className="text-right">
              <h1 className="text-xl font-bold text-white font-lexend">{title}</h1>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-400 w-full"></div>
    </div>
  );
};

export default ApplicationHeader;
