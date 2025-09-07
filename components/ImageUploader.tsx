import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  title: string;
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onFileSelect, previewUrl, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h3 className="text-base font-medium text-gray-800 mb-2 text-center">{title}</h3>
      <div
        onClick={handleClick}
        className={`relative w-full aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-gray-500 transition-all duration-300 overflow-hidden group
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-indigo-400 hover:bg-slate-100'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Image</span>
              </div>
            )}
          </>
        ) : (
          <>
            <UploadIcon />
            <p className="mt-2 text-sm">Click to upload</p>
            <p className="text-xs">PNG, JPG, etc.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;