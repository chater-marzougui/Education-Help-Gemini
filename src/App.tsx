import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SetupPage } from '@/pages/SetupPage';
import { UploadPage } from '@/pages/UploadPage';
import { ViewerPage } from '@/pages/ViewerPage';

function App() {
  return (
    <BrowserRouter>
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
