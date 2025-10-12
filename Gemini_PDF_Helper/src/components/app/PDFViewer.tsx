import { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  file: File;
  onPageChange?: (page: number) => void;
  onPageRender?: (imageData: string) => void;
  currentPage: number;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export function PDFViewer({ file, onPageChange, onPageRender, currentPage, scale, onScaleChange }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // Notify parent with image data
        if (onPageRender) {
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          onPageRender(imageData);
        }
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, onPageRender]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      onPageChange?.(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      onPageChange?.(newPage);
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale * 1.2, 3.0);
    onScaleChange(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale / 1.2, 0.25);
    onScaleChange(newScale);
  };

  const handleFitToWidth = () => {
    const container = canvasRef.current?.parentElement;
    if (container && canvasRef.current) {
      const containerWidth = container.clientWidth - 40;
      const canvasWidth = canvasRef.current.width / scale;
      const newScale = Math.max(0.25, Math.min(3.0, containerWidth / canvasWidth));
      onScaleChange(newScale);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium whitespace-nowrap min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleFitToWidth}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex items-start justify-center min-h-full">
          <canvas
            ref={canvasRef}
            className="shadow-lg bg-white max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
