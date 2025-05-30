
import React from 'react';

interface ApplicationHeaderProps {
  title?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ 
  title
}) => {
  return (
    <div className="bg-dark-grey w-full overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-full"></div>
      <div className="w-full px-6 py-3 relative h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="transform rotate-12 -my-1">
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
                className="h-6"
              />
              <p className="text-xs text-gray-300 font-lexend mt-1">
                The leading estate agents in Essex & Suffolk.
              </p>
            </div>
          </div>
          {title && (
            <div className="text-right">
              <h1 className="text-xl font-bold text-white font-lexend">{title}</h1>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-full"></div>
    </div>
  );
};

export default ApplicationHeader;
