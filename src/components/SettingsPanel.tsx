import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import type { Settings } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const savePrompt = () => {
    localStorage.setItem('dot-viz-prompt', settings.prompt);
  };

  const saveApiKey = () => {
    localStorage.setItem('dot-viz-api-key', settings.apiKey);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Settings"
      >
        <SettingsIcon className={clsx(
          'w-6 h-6 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                value={settings.prompt}
                onChange={(e) => onSettingsChange({ ...settings, prompt: e.target.value })}
                className="w-full h-32 p-2 text-sm border rounded-md"
                placeholder="Enter your prompt here..."
              />
              <button
                onClick={savePrompt}
                className="mt-2 flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Save size={16} />
                Save Prompt
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => onSettingsChange({ ...settings, apiKey: e.target.value })}
                  className="w-full p-2 pr-10 text-sm border rounded-md"
                  placeholder="Enter your API key..."
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={saveApiKey}
                className="mt-2 flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Save size={16} />
                Save API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}