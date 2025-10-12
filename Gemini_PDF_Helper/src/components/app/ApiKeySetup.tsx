import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check, Save, Trash2 } from 'lucide-react';
import { validateApiKey } from '@/services/gemini';

interface ApiKeySetupProps {
  onApiKeyValidated: (apiKey: string) => void;
  initialApiKey?: string;
}

export function ApiKeySetup({ onApiKeyValidated, initialApiKey = '' }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(!!initialApiKey);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError('');
    
    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        setIsValidated(true);
        setError('');
      } else {
        setError('Invalid API key. Please check and try again.');
        setIsValidated(false);
      }
    } catch (err) {
      setError('Failed to validate API key. Please try again.');
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (isValidated && apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      onApiKeyValidated(apiKey);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setIsValidated(false);
    setError('');
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold text-center">
            PDF AI Viewer
          </CardTitle>
          <CardDescription className="text-center text-base">
            Upload your PDF and get AI-powered slide explanations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: API Key Setup */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold">Configure Google AI API</h3>
            </div>

            <div className={`p-4 rounded-lg ${isValidated ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>🔑</span>
                <span>{isValidated ? 'API Key Configured' : 'API Key Not Configured'}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <div className="text-2xl">🔒</div>
                <div className="flex-1 text-sm">
                  <strong>Security Notice:</strong> Your API key is stored locally in your browser and never sent to our servers. We prioritize your privacy and security.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="apiKey">Google AI Studio API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsValidated(false);
                    setError('');
                  }}
                  placeholder="Enter your API key (AIza...)"
                  className="pr-24"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    title={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleValidate}
                    disabled={isValidating || !apiKey}
                    title="Validate API key"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={!isValidated}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save API Key
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Don't have an API key?{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get one from Google AI Studio →
              </a>
            </p>
          </div>

          {/* Step 2: Launch Viewer */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold">Launch Viewer</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Once you've configured your API key, you can launch the viewer to analyze your slides.
            </p>

            <Button
              onClick={handleSave}
              disabled={!isValidated}
              className="w-full"
              size="lg"
            >
              🚀 Launch PDF AI Viewer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
