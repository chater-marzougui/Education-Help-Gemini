import { useNavigate } from "react-router-dom";
import { ApiKeySetup } from "@/components/app/ApiKeySetup";
import { Logo } from "@/components/app/Logo";
import { SEO } from "@/components/app/SEO";
import { useState } from "react";

export function SetupPage() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("gemini_api_key") || null
  );
  const navigate = useNavigate();

  const handleApiKeyValidated = (key: string) => {
    setApiKey(key);
    navigate("./upload");
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
          <ApiKeySetup
            onApiKeyValidated={handleApiKeyValidated}
            initialApiKey={apiKey}
          />
        </div>
      </div>
    </>
  );
}
