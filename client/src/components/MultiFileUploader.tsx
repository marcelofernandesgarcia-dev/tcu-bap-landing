import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useOCR, OCRResult } from '@/hooks/useOCR';

interface MultiFileUploaderProps {
  onFilesProcessed: (results: OCRResult[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  onFilesProcessed,
  maxFiles = 10,
  maxSizeMB = 100,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { processFiles, isProcessing, progress, error } = useOCR();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]): boolean => {
    // Verificar número de arquivos
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return false;
    }

    // Verificar tamanho total
    const totalSize = [...selectedFiles, ...files].reduce((sum, f) => sum + f.size, 0);
    if (totalSize > maxSizeMB * 1024 * 1024) {
      alert(`Tamanho total não pode exceder ${maxSizeMB}MB`);
      return false;
    }

    // Verificar tipos de arquivo
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(`Tipo de arquivo não suportado: ${file.type}`);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (validateFiles(files)) {
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (validateFiles(files)) {
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Selecione pelo menos um arquivo');
      return;
    }

    const results = await processFiles(selectedFiles);
    onFilesProcessed(results);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Formatos suportados: PDF, PNG, JPEG, TIFF (máx. {maxSizeMB}MB)
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
          disabled={isProcessing}
        />
        <label htmlFor="file-input">
          <Button
            asChild
            disabled={isProcessing}
            className="cursor-pointer"
          >
            <span>Selecionar Arquivos</span>
          </Button>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erro ao processar</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Arquivos selecionados ({selectedFiles.length})
          </h3>
          <div className="space-y-2 mb-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                    <p className="text-xs text-slate-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isProcessing}
                  className="text-slate-400 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{progress.status}</span>
                <span className="text-slate-600">
                  {progress.current} de {progress.total}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleProcessFiles}
              disabled={isProcessing || selectedFiles.length === 0}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Processar Arquivos
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={isProcessing}
            >
              Limpar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
