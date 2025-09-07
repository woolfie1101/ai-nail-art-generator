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
      <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">{title}</h3>
      <div
        onClick={handleClick}
        className={`relative w-full aspect-square bg-white/80 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 transition-all duration-300 overflow-hidden group
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-purple-400 hover:text-purple-600'}
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
                <span className="text-white font-semibold">Change Image</span>
              </div>
            )}
          </>
        ) : (
          <>
            <UploadIcon />
            <p className="mt-2">Click to upload</p>
            <p className="text-sm">PNG, JPG, etc.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;