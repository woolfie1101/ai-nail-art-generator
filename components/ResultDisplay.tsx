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
      <div className="text-center text-gray-500 p-12 bg-slate-50/80 border-2 border-dashed border-gray-200 rounded-lg">
        Your generated nail art will appear here.
      </div>
    );
  }

  if (appState.status === AppStatus.LOADING) {
    return (
        <div className="w-full aspect-square bg-slate-50/80 rounded-lg flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-800 font-medium">{loadingMessage}</p>
            <p className="text-gray-500 text-sm">This can take a moment.</p>
        </div>
    );
  }

  if (appState.status === AppStatus.SUCCESS) {
    return (
      <div>
        <h3 className="text-xl font-medium text-center mb-4 text-gray-900">Your Masterpiece!</h3>
        <div className="relative group mb-6">
          <img
            src={appState.result}
            alt="Generated nail art"
            className="w-full rounded-lg shadow-md border border-gray-200"
          />
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label htmlFor="iterative-prompt" className="block text-base font-medium text-gray-800 mb-2">
            Refine your design
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              id="iterative-prompt"
              type="text"
              value={iterativePrompt}
              onChange={(e) => setIterativePrompt(e.target.value)}
              placeholder="e.g., 'Make the ring finger glittery', 'change to a blue color'"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition flex-grow disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isQuotaExhausted}
            />
            <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
               <button
                onClick={onRegenerate}
                disabled={isQuotaExhausted}
                className={`inline-flex items-center gap-2 px-5 py-2 text-white text-sm font-semibold rounded-full shadow-sm transition w-full justify-center sm:w-auto
                  ${isQuotaExhausted ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-700'}
                `}
              >
                <ReloadIcon />
                Regenerate
              </button>
              <a
                href={isQuotaExhausted ? undefined : appState.result}
                download="nail-art.png"
                className={`inline-flex items-center justify-center p-2.5 text-gray-700 font-semibold rounded-full shadow-sm transition border border-gray-300
                  ${isQuotaExhausted ? 'bg-gray-300 cursor-not-allowed pointer-events-none' : 'bg-white hover:bg-gray-100'}
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