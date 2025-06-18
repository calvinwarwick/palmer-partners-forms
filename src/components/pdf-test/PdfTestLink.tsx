
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const PdfTestLink = () => {
  const handlePdfTest = () => {
    const pdfUrl = '/Reposit_Tenant_deposit_information.pdf';
    console.log('Attempting to access PDF at:', pdfUrl);
    
    // Try opening in new tab
    const newWindow = window.open(pdfUrl, '_blank');
    
    // If popup blocked, try direct navigation
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.log('Popup blocked, trying direct navigation');
      window.location.href = pdfUrl;
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={handlePdfTest}
        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Test PDF Access
      </Button>
      <p className="text-sm text-gray-600 mt-2">
        Click to test if the Reposit PDF is accessible
      </p>
    </div>
  );
};

export default PdfTestLink;
