import React from 'react';
import type { AppState } from '../types';
import { AppStatus } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { ReloadIcon } from './icons/ReloadIcon';

interface ResultDisplayProps {
  appState: AppState;
  onRegenerate: () => void;
  iterativePrompt: string;
  setIterativePrompt: (prompt: string) => void;
  isQuotaExhausted: boolean;
  loadingMessage: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ appState, onRegenerate, iterativePrompt, setIterativePrompt, isQuotaExhausted, loadingMessage }) => {
  if (appState.status === AppStatus.IDLE) {
    return (
      <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        Your generated nail art will appear here.
      </div>
    );
  }

  if (appState.status === AppStatus.LOADING) {
    return (
        <div className="w-full aspect-square bg-gray-100/50 rounded-lg flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-purple-700 font-semibold">{loadingMessage}</p>
            <p className="text-gray-500 text-sm">This can take a moment.</p>
        </div>
    );
  }

  if (appState.status === AppStatus.SUCCESS) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-center mb-4">Your Masterpiece!</h3>
        <div className="relative group mb-6">
          <img
            src={appState.result}
            alt="Generated nail art"
            className="w-full rounded-lg shadow-lg border"
          />
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <label htmlFor="iterative-prompt" className="block text-lg font-medium text-gray-700 mb-2">
            Refine your design
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              id="iterative-prompt"
              type="text"
              value={iterativePrompt}
              onChange={(e) => setIterativePrompt(e.target.value)}
              placeholder="e.g., 'Make the ring finger glittery', 'change to a blue color'"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition flex-grow disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isQuotaExhausted}
            />
            <div className="flex items-center justify-center gap-4">
               <button
                onClick={onRegenerate}
                disabled={isQuotaExhausted}
                className={`inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full shadow-md transition
                  ${isQuotaExhausted ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                `}
              >
                <ReloadIcon />
                Regenerate
              </button>
              <a
                href={isQuotaExhausted ? undefined : appState.result}
                download="nail-art.png"
                className={`inline-flex items-center justify-center p-3 text-white font-semibold rounded-full shadow-md transition
                  ${isQuotaExhausted ? 'bg-gray-400 cursor-not-allowed pointer-events-none' : 'bg-green-500 hover:bg-green-600'}
                `}
                aria-label="Download Image"
                aria-disabled={isQuotaExhausted}
              >
                <DownloadIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state is handled in App.tsx, but this is a fallback
  if (appState.status === AppStatus.ERROR) {
    return null;
  }

  return null;
};

export default ResultDisplay;