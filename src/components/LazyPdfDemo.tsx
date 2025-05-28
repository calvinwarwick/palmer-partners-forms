
import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load the PDF demo to reduce initial bundle size
const PdfDemo = lazy(() => import('@/pages/PdfDemo'));

const LazyPdfDemo = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <PdfDemo />
    </Suspense>
  );
};

export default LazyPdfDemo;
