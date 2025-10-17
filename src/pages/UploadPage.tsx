import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/app/FileUpload";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function UploadPage() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("gemini_api_key") || null
  );
  const navigate = useNavigate();

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
      <div className="absolute top-4 left-4 z-10">
        <Button variant="outline" onClick={handleBackToSetup}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </Button>
      </div>
      <FileUpload onFileSelect={handleFileSelect} />
    </div>
  );
}
