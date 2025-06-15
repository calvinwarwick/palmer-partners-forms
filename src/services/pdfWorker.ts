
// Simplified PDF worker - fallback to direct generation
import { generateApplicationPDF } from './pdfService';

export const generatePDFInWorker = async (data: any): Promise<Uint8Array> => {
  // Direct fallback since workers can be complex in different environments
  console.log('Generating PDF directly (worker fallback)');
  return await generateApplicationPDF(data);
};
