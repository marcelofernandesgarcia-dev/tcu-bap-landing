import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Loader2, X, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  selected: boolean;
  status?: "pending" | "uploading" | "processing" | "success" | "error";
  progress?: number;
  error?: string;
  file?: File;
}

/**
 * Componente para upload e processamento de múltiplos arquivos
 * Aceita até 15 arquivos, máximo 100MB total
 */
export function MultipleFileUpload() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadChunkedMutation = trpc.uploadChunked.processBatchChunks.useMutation();

  /**
   * Adicionar múltiplos arquivos
   */
  const handleFileSelect = useCallback(
    (selectedFileList: FileList | null) => {
      if (!selectedFileList) return;

      const newFiles: FileItem[] = Array.from(selectedFileList).map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        selected: true,
        status: "pending",
        progress: 0,
        file: file,
      }));

      // Validar limite de 15 arquivos
      const totalFiles = files.length + newFiles.length;
      if (totalFiles > 15) {
        alert(`Máximo 15 arquivos permitidos. Você selecionou ${totalFiles}.`);
        return;
      }

      // Validar tamanho total
      const totalSize = files.reduce((sum, f) => sum + f.size, 0) +
        newFiles.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > 100 * 1024 * 1024) {
        alert(`Tamanho total excede 100MB. Total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [files]
  );

  /**
   * Alternar seleção de arquivo
   */
  const toggleFileSelection = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    );
  }, []);

  /**
   * Remover arquivo
   */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  /**
   * Selecionar/Desselecionar todos
   */
  const toggleSelectAll = useCallback(() => {
    const allSelected = files.every((f) => f.selected);
    setFiles((prev) => prev.map((f) => ({ ...f, selected: !allSelected })));
  }, [files]);

  /**
   * Processar arquivos selecionados
   */
  const handleProcessBatch = useCallback(async () => {
    const selectedFiles = files.filter((f) => f.selected && f.file);

    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo");
      return;
    }

    setIsProcessing(true);
    setTotalProgress(0);

    try {
      // Simular processamento
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileIndex = files.findIndex((f) => f.id === file.id);

        // Atualizar para uploading
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "uploading", progress: 0 } : f
          )
        );

        // Simular upload em chunks
        for (let chunk = 0; chunk < 5; chunk++) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          const progress = Math.min(((chunk + 1) / 5) * 100, 100);
          
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex ? { ...f, progress } : f
            )
          );
        }

        // Atualizar para processing
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "processing", progress: 100 } : f
          )
        );

        // Simular processamento
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Atualizar para success
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "success" } : f
          )
        );

        // Atualizar progresso total
        setTotalProgress(((i + 1) / selectedFiles.length) * 100);
      }
    } catch (error) {
      alert(`Erro ao processar: ${error}`);
      setFiles((prev) =>
        prev.map((f) =>
          f.selected ? { ...f, status: "error", error: String(error) } : f
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  /**
   * Limpar todos os arquivos
   */
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setTotalProgress(0);
  }, []);

  const selectedCount = files.filter((f) => f.selected).length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const selectedSize = files
    .filter((f) => f.selected)
    .reduce((sum, f) => sum + f.size, 0);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "uploading":
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload de Múltiplos Arquivos</h2>
        <p className="text-gray-600">
          Selecione até 15 arquivos para análise em batch (máximo 100MB)
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition">
        <label className="flex flex-col items-center justify-center cursor-pointer space-y-3">
          <Upload className="w-12 h-12 text-blue-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              Clique para selecionar ou arraste múltiplos arquivos
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOCX, DOC, TXT, HTML (até 15 arquivos, 100MB total)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt,.html"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isProcessing}
            className="hidden"
          />
        </label>
      </Card>

      {/* Stats */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total de Arquivos</p>
            <p className="text-2xl font-bold">{files.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Selecionados</p>
            <p className="text-2xl font-bold text-blue-600">{selectedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Tamanho Total</p>
            <p className="text-2xl font-bold">{formatFileSize(selectedSize)}</p>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && totalProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Progresso Total</p>
            <p className="text-sm text-gray-600">{Math.round(totalProgress)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4 space-y-4">
          {/* Select All */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={files.every((f) => f.selected)}
                onCheckedChange={toggleSelectAll}
                disabled={isProcessing}
              />
              <span className="text-sm font-medium">
                Selecionar Todos ({files.length})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={isProcessing}
            >
              Limpar Tudo
            </Button>
          </div>

          {/* File Items */}
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={file.selected}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                    disabled={isProcessing}
                  />
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {file.progress !== undefined && file.progress > 0 && file.progress < 100 && (
                  <div className="w-24 bg-gray-200 rounded-full h-1 mx-2">
                    <div
                      className="bg-blue-600 h-1 rounded-full transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={isProcessing}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex gap-3">
          <Button
            onClick={handleProcessBatch}
            disabled={isProcessing || selectedCount === 0}
            className="flex-1"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Processar {selectedCount} Arquivo{selectedCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
