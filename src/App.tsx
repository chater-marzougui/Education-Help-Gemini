import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SetupPage } from '@/pages/SetupPage';
import { UploadPage } from '@/pages/UploadPage';
import { ViewerPage } from '@/pages/ViewerPage';

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const theme = savedTheme.replace(/"/g, '') as 'light' | 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <BrowserRouter basename="/Education-Help-Gemini">
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
