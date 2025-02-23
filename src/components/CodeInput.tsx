import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface CodeInputProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeInput({ code, onChange }: CodeInputProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className="relative h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 font-mono text-sm bg-gray-50 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Paste your code here or drag & drop a file..."
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!code && (
          <div className="flex flex-col items-center text-gray-400">
            <Upload size={24} />
            <span className="mt-2">Drop file here</span>
          </div>
        )}
      </div>
    </div>
  );
}