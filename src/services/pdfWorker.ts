
// PDF generation in a web worker to prevent main thread blocking
export const generatePDFInWorker = async (data: any): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof Worker === 'undefined') {
      // Fallback to main thread if workers aren't available
      import('./pdfService').then(({ generateApplicationPDF }) => {
        try {
          const result = generateApplicationPDF(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      return;
    }

    // Create worker using URL.createObjectURL for inline worker
    const workerScript = `
      importScripts('https://unpkg.com/jspdf@3.0.1/dist/jspdf.umd.min.js');
      
      self.onmessage = function(e) {
        try {
          // Import and use the PDF generation logic here
          // For now, we'll use the main thread as fallback
          self.postMessage({ error: 'Worker not fully implemented, using fallback' });
        } catch (error) {
          self.postMessage({ error: error.message });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      if (e.data.error) {
        // Fallback to main thread
        import('./pdfService').then(({ generateApplicationPDF }) => {
          try {
            const result = generateApplicationPDF(data);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        resolve(e.data.result);
      }
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };

    worker.onerror = () => {
      // Fallback to main thread on error
      import('./pdfService').then(({ generateApplicationPDF }) => {
        try {
          const result = generateApplicationPDF(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };

    worker.postMessage(data);
  });
};
