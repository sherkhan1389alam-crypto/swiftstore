import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/cropImage';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, X, Check, RefreshCcw } from 'lucide-react';

interface ImageCropperProps {
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
  maxSize?: number;
  quality?: number;
  title?: string;
  imageSrc: string;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 1, cropShape = 'round', maxSize = 500, quality = 0.9, title = 'Crop Image' }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, { horizontal: false, vertical: false }, maxSize, quality);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white z-10">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="relative flex-1 w-full h-full">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          cropShape={cropShape}
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
          classes={{ containerClassName: 'bg-black/90' }}
        />
      </div>

      {/* Controls Area */}
      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-10 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Zoom & Rotate Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-200">
              <button 
                onClick={() => setZoom(Math.max(1, zoom - 0.2))} 
                className="p-3 hover:bg-white rounded-full transition-colors hover:shadow-sm"
              >
                <ZoomOut className="w-5 h-5 text-slate-700" />
              </button>
              <span className="text-xs font-bold w-8 text-center text-slate-700">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={() => setZoom(Math.min(3, zoom + 0.2))} 
                className="p-3 hover:bg-white rounded-full transition-colors hover:shadow-sm"
              >
                <ZoomIn className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setRotation(rotation - 90)} 
                className="p-3.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
              >
                <RotateCcw className="w-5 h-5 text-slate-700" />
              </button>
              <button 
                onClick={() => setRotation(rotation + 90)} 
                className="p-3.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
              >
                <RotateCw className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={handleReset}
              className="col-span-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
            <button 
              onClick={handleSave}
              disabled={isProcessing}
              className="col-span-2 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0b382d] text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-colors disabled:opacity-70 shadow-lg shadow-emerald-900/20 uppercase tracking-widest"
            >
              {isProcessing ? 'Processing...' : <><Check className="w-4 h-4" /> Crop & Save</>}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
