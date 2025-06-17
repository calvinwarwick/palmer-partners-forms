
import React from 'react';

interface ApplicationHeaderProps {
  title?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ 
  title
}) => {
  return (
    <div className="bg-dark-grey w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 py-3 sm:py-6 relative flex flex-col sm:flex-row sm:items-center sm:h-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center space-x-3 sm:space-x-4 justify-center sm:justify-start">
            <div className="transform rotate-12 -my-1 sm:-my-2">
              <img 
                src="/lovable-uploads/fb64eebc-b467-4dd1-b635-6d1817b04c67.png" 
                alt="Palmer & Partners P Logo" 
                className="h-12 w-12 sm:h-20 sm:w-20 object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <img 
                src="/lovable-uploads/8958574e-86f0-4482-9a99-322142a0f734.png" 
                alt="Palmer & Partners Text Logo" 
                className="h-8 sm:h-12 object-contain"
              />
            </div>
          </div>
          {title && (
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h1 className="text-lg sm:text-xl font-bold text-white font-lexend">{title}</h1>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-400 w-full"></div>
    </div>
  );
};

export default ApplicationHeader;
