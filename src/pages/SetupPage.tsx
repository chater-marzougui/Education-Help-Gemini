import { useNavigate } from 'react-router-dom';
import { ApiKeySetup } from '@/components/app/ApiKeySetup';
import { Logo } from '@/components/app/Logo';
import { SEO } from '@/components/app/SEO';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export function SetupPage() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const navigate = useNavigate();

  // Redirect to upload page if API key already exists
  useEffect(() => {
    if (apiKey) {
      navigate('/upload');
    }
  }, [apiKey, navigate]);

  const handleApiKeyValidated = (key: string) => {
    setApiKey(key);
    navigate('/upload');
  };

  return (
    <>
      <SEO 
        title="Setup - PDF AI Viewer"
        description="Configure your Google Gemini API key to start analyzing PDFs with AI-powered insights."
      />
      <div className="min-h-screen flex flex-col">
        <header className="p-6 border-b bg-card">
          <Logo size="md" className="justify-center" />
        </header>
        <div className="flex-1">
          <ApiKeySetup onApiKeyValidated={handleApiKeyValidated} initialApiKey={apiKey} />
        </div>
      </div>
    </>
  );
}
