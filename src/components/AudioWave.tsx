import React from 'react';

interface AudioWaveProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioWave: React.FC<AudioWaveProps> = ({ isPlaying, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 h-6 px-2 ${className}`} aria-hidden="true">
      <span
        className={`w-1 rounded-full bg-blue-500 transition-all duration-300 ${
          isPlaying ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-blue-500 transition-all duration-200 delay-75 ${
          isPlaying ? 'h-3 animate-pulse' : 'h-1.5 opacity-40'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-blue-500 transition-all duration-150 delay-150 ${
          isPlaying ? 'h-6 animate-pulse' : 'h-1.5 opacity-40'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-blue-500 transition-all duration-300 delay-100 ${
          isPlaying ? 'h-4 animate-pulse' : 'h-1.5 opacity-40'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-blue-500 transition-all duration-200 delay-200 ${
          isPlaying ? 'h-2 animate-pulse' : 'h-1.5 opacity-40'
        }`}
      />
    </div>
  );
};
