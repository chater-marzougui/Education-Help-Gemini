import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/app/FileUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export function UploadPage() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const navigate = useNavigate();

  // Redirect to setup if no API key
  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    }
  }, [apiKey, navigate]);

  const handleFileSelect = (file: File) => {
    // Store the file in sessionStorage for the viewer page
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('selectedPDF', reader.result as string);
      sessionStorage.setItem('selectedPDFName', file.name);
      navigate('/viewer');
    };
    reader.readAsDataURL(file);
  };

  const handleBackToSetup = () => {
    setApiKey('');
    navigate('/');
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
