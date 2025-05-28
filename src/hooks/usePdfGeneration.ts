
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePDFInWorker } from '@/services/pdfWorker';

export const usePdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePdf = async (data: any, filename: string = 'document.pdf') => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your document.",
      });

      const pdfBytes = await generatePDFInWorker(data);
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated Successfully!",
        description: `${filename} has been downloaded.`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePdf,
  };
};
