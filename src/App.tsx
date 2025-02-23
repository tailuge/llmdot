import { useState, useEffect } from 'react';
import { CodeInput } from './components/CodeInput';
import { DiagramOutput } from './components/DiagramOutput';
import { SettingsPanel } from './components/SettingsPanel';
import { generateDotDiagram } from './lib/llm';
import { Play } from 'lucide-react';
import type { Settings, LLMResponse } from './types';

const DEFAULT_PROMPT = "Create a DOT diagram representing the relationships in the code. States will be rendered as nodes and transitions between states will be arcs. Output ONLY valid DOT syntax for the diagram in plain text.";

const DEFAULT_CODE = `class MyCode {

state inactive(actionView, actionActivate)
state active(actionView, actionDeactivate)
state deactivated()

}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [settings, setSettings] = useState<Settings>({
    prompt: '',
    apiKey: ''
  });
  const [dotResult, setDotResult] = useState<LLMResponse>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load saved settings
  useEffect(() => {
    const savedPrompt = localStorage.getItem('dot-viz-prompt') || DEFAULT_PROMPT;
    const savedApiKey = localStorage.getItem('dot-viz-api-key') || '';
    setSettings({ prompt: savedPrompt, apiKey: savedApiKey });
  }, []);

  const handleGenerateDiagram = async () => {
    if (!code || !settings.prompt || !settings.apiKey) {
      setDotResult({ error: 'Please provide code, prompt, and API key' });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateDotDiagram(code, settings.prompt, settings.apiKey);
      setDotResult(result);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Code-to-DOT</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerateDiagram}
              disabled={isGenerating || !settings.apiKey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} />
              {isGenerating ? 'Generating...' : 'Generate Diagram'}
            </button>
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          <CodeInput code={code} onChange={setCode} />
          
          <div className="relative">
            {dotResult.error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 rounded-lg p-4">
                <p className="text-red-500 text-center mb-4">{dotResult.error}</p>
                {dotResult.rawResponse && (
                  <pre className="bg-white p-4 rounded-lg overflow-auto max-h-[80%] w-full text-sm">
                    {JSON.stringify(dotResult.rawResponse, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <DiagramOutput dotCode={dotResult.dotCode || ''} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;