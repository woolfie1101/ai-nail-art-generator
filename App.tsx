import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { fileToBase64 } from './utils/fileUtils';
import { generateNailArt } from './services/geminiService';
import type { AppState } from './types';
import { AppStatus } from './types';
import InspirationCarousel from './components/InspirationCarousel';
import ErrorModal from './components/ErrorModal';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<File | null>(null);
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [iterativePrompt, setIterativePrompt] = useState<string>('');
  const [appState, setAppState] = useState<AppState>({ status: AppStatus.IDLE });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const loadingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  const handleInitialGenerate = useCallback(async () => {
    if (!baseImage || !styleImage) {
      setAppState({ status: AppStatus.ERROR, error: 'Please upload both a hand photo and a style image.' });
      return;
    }

    setAppState({ status: AppStatus.LOADING });
    const messages = [
      'Analyzing hand photo...',
      'Reading style image...',
      'Generating nail art...',
      'Applying final touches...',
    ];
    let messageIndex = 0;
    setLoadingMessage(messages[messageIndex]);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2500);

    try {
      const baseImageBase64 = await fileToBase64(baseImage);
      const styleImageBase64 = await fileToBase64(styleImage);

      const generatedImageBase64 = await generateNailArt(
        { data: baseImageBase64, mimeType: baseImage.type },
        { data: styleImageBase64, mimeType: styleImage.type },
        prompt,
        false
      );

      setAppState({ status: AppStatus.SUCCESS, result: `data:image/png;base64,${generatedImageBase64}` });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message === 'QUOTA_EXHAUSTED') {
        setModalMessage("Today's nail art generation is closed.");
        setIsModalOpen(true);
        setIsQuotaExhausted(true);
        setAppState({ status: AppStatus.IDLE }); // Reset state
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setAppState({ status: AppStatus.ERROR, error: `Failed to generate nail art. ${errorMessage}` });
      }
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }
  }, [baseImage, styleImage, prompt]);
  
  const handleRegenerate = useCallback(async () => {
    const currentResult = appState.status === AppStatus.SUCCESS ? appState.result : null;

    if (!currentResult) {
        setAppState({ status: AppStatus.ERROR, error: 'No image to regenerate from.' });
        return;
    }

    if (!iterativePrompt.trim()) {
        setAppState({ status: AppStatus.ERROR, error: 'Please describe the change you want to make.' });
        return;
    }

    setAppState({ status: AppStatus.LOADING });
     const messages = [
        'Analyzing your request...',
        'Modifying the image...',
        'Applying final touches...',
    ];
    let messageIndex = 0;
    setLoadingMessage(messages[messageIndex]);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2500);


    try {
        const parts = currentResult.split(',');
        const meta = parts[0].split(':')[1].split(';')[0];
        const base64Data = parts[1];
        
        const generatedImageBase64 = await generateNailArt(
            { data: base64Data, mimeType: meta },
            null,
            iterativePrompt,
            true
        );
        
        setAppState({ status: AppStatus.SUCCESS, result: `data:image/png;base64,${generatedImageBase64}` });
        setIterativePrompt('');
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === 'QUOTA_EXHAUSTED') {
          setModalMessage("Today's nail art generation is closed.");
          setIsModalOpen(true);
          setIsQuotaExhausted(true);
          // Revert to the success state with the last good image
          setAppState(appState); 
        } else {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          setAppState({ status: AppStatus.ERROR, error: `Failed to regenerate nail art. ${errorMessage}` });
        }
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }
  }, [appState, iterativePrompt]);

  const canGenerate = baseImage && styleImage && appState.status !== AppStatus.LOADING && !isQuotaExhausted;
  const baseImagePreview = baseImage ? URL.createObjectURL(baseImage) : null;
  const styleImagePreview = styleImage ? URL.createObjectURL(styleImage) : null;

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-200/80">
          
          <InspirationCarousel />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader title="Your Hand Photo" onFileSelect={setBaseImage} previewUrl={baseImagePreview} disabled={isQuotaExhausted} />
            <ImageUploader title="Style Reference Image" onFileSelect={setStyleImage} previewUrl={styleImagePreview} disabled={isQuotaExhausted} />
          </div>

          <div className="mb-8">
            <label htmlFor="prompt" className="block text-base font-medium text-gray-700 mb-2">
              Describe your desired mood (Optional)
            </label>
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'cosmic glitter', 'delicate floral', 'bold geometric'"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isQuotaExhausted}
            />
          </div>
          
          <div className="text-center mb-8">
            <button
              onClick={handleInitialGenerate}
              disabled={!canGenerate}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white rounded-full shadow-sm transition-all duration-300 ease-in-out
                ${canGenerate ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              <SparklesIcon />
              {appState.status === AppStatus.LOADING ? 'Generating...' : 'Generate Nail Art'}
            </button>
          </div>
          
          {appState.status === AppStatus.ERROR && (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 p-3 rounded-lg mb-6">
              {appState.error}
            </div>
          )}
          
          <ResultDisplay 
            appState={appState} 
            onRegenerate={handleRegenerate}
            iterativePrompt={iterativePrompt}
            setIterativePrompt={setIterativePrompt}
            isQuotaExhausted={isQuotaExhausted}
            loadingMessage={loadingMessage}
          />
        </div>
      </main>
      <Footer />
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default App;