
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Maximize2, X, Pen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SignaturePadProps {
  value?: string;
  onChange?: (signature: string) => void;
  fullName?: string;
  onFullNameChange?: (name: string) => void;
  width?: number;
  height?: number;
}

const SignaturePad = ({ 
  value, 
  onChange, 
  fullName = "",
  onFullNameChange,
  width = 600, 
  height = 200 
}: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width, height });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && !isFullscreen) {
        const containerWidth = containerRef.current.clientWidth - 32; // Account for padding
        const aspectRatio = height / width;
        const newWidth = Math.min(containerWidth, width);
        const newHeight = newWidth * aspectRatio;
        
        setCanvasSize({ width: newWidth, height: newHeight });
      } else if (isFullscreen) {
        // Fullscreen mode - use screen dimensions
        setCanvasSize({ 
          width: window.innerWidth - 40, 
          height: window.innerHeight - 120 
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [width, height, isFullscreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Enable smooth curves
    ctx.imageSmoothingEnabled = true;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing signature if provided
    if (value && value.startsWith('data:image/')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSignature(true);
        setHasStartedDrawing(true);
      };
      img.src = value;
    }
  }, [value, canvasSize]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasStartedDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    e.preventDefault();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);

    // Convert to base64 and call onChange
    const canvas = canvasRef.current;
    if (canvas && onChange) {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      onChange(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setHasStartedDrawing(false);
    if (onChange) {
      onChange('');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fullscreen overlay component
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Digital Signature</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Exit Fullscreen
          </Button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className={`relative bg-white rounded-lg overflow-hidden shadow-sm flex-1 ${
            hasSignature ? 'border-2 border-green-500' : 'border-2 border-black'
          }`}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair w-full h-full block touch-none"
              style={{ 
                width: '100%', 
                height: '100%'
              }}
            />
            
            {!hasStartedDrawing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400">
                  <Pen className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-lg">Sign here</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <Card className="w-full border border-gray-300 bg-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-black">
            Digital Signature Required
          </CardTitle>
          <p className="text-sm text-gray-600">
            Please sign in the box below using your mouse or touch screen. Your signature will be included in the PDF application.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className={`relative bg-white rounded-lg overflow-hidden shadow-sm transition-colors duration-300 ${
              hasSignature ? 'border-2 border-green-500' : 'border-2 border-black'
            }`}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair w-full block touch-none"
                style={{ 
                  width: '100%', 
                  height: `${canvasSize.height}px`,
                  minHeight: '150px'
                }}
              />
              
              {!hasStartedDrawing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400">
                    <Pen className="h-5 w-5 mx-auto mb-2" />
                    <p className="text-sm">Sign here</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Clear button positioned at bottom right */}
            <div className="absolute bottom-2 right-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSignature}
                disabled={!hasSignature}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Type full name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => onFullNameChange?.(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            
            {isMobile && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen Signature
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignaturePad;
