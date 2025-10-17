import { useNavigate } from "react-router-dom";
import { ApiKeySetup } from "@/components/app/ApiKeySetup";
import { Logo } from "@/components/app/Logo";
import { SEO } from "@/components/app/SEO";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { getApiKey } from "@/lib/utils";

export function SetupPage() {
  const [apiKey, setApiKey] = useState<string | null>(
    getApiKey()
  );
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
        <header className="p-6 border-b bg-card flex items-center justify-between">
          <Logo size="md" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="ml-auto"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
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
