import { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  title?: string;
  children: React.ReactNode;
}

export function ImageModal({ src, alt, title, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'infografico.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Trigger - Clickable wrapper */}
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
          }
        }}
      >
        {children}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 bg-black/70 px-4 py-2 rounded-full text-white text-sm font-medium">
            <ZoomIn className="w-4 h-4" />
            Clique para ampliar
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                {title && <h3 className="text-xl font-bold text-slate-900">{title}</h3>}
                <p className="text-sm text-slate-600">{alt}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 overflow-auto">
              <div 
                className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={src}
                  alt={alt}
                  className={`max-w-full transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    maxHeight: isZoomed ? 'none' : '70vh',
                    objectFit: 'contain'
                  }}
                />
                
                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-xs font-medium">
                  {isZoomed ? 'Clique para reduzir' : 'Clique para ampliar'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Dica: Clique na imagem para ampliar/reduzir
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
