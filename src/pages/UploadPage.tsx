import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/app/FileUpload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { getApiKey } from "@/lib/utils";

export function UploadPage() {
  const [apiKey, setApiKey] = useState<string | null>(
    getApiKey()
  );
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Redirect to setup if no API key
  useEffect(() => {
    if (!apiKey) {
      navigate("../");
    }
  }, [apiKey, navigate]);

  const handleFileSelect = (file: File) => {
    // Pass the file directly through navigation state
    navigate("../viewer", { state: { file } });
  };

  const handleBackToSetup = () => {
    setApiKey("");
    navigate("../");
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button variant="outline" onClick={handleBackToSetup}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </Button>
        <Button variant="outline" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      <FileUpload onFileSelect={handleFileSelect} />
    </div>
  );
}
