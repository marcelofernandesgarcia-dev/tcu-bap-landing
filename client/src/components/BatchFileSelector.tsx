import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Loader2, X } from "lucide-react";
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
}

/**
 * Componente para seleção e processamento em batch de múltiplos arquivos
 */
export function BatchFileSelector() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);

  const uploadChunkedMutation = trpc.uploadChunked.processBatchChunks.useMutation();

  /**
   * Adicionar arquivo à lista
   */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);

      const newFiles: FileItem[] = selectedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        selected: true,
        status: "pending",
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
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
   * Remover arquivo da lista
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
    const selectedFiles = files.filter((f) => f.selected);

    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo");
      return;
    }

    setIsProcessing(true);
    setTotalProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileIndex = files.findIndex((f) => f.id === file.id);

        // Atualizar status para uploading
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "uploading", progress: 0 } : f
          )
        );

        // Simular upload em chunks
        const chunkSize = 5 * 1024 * 1024; // 5MB
        const totalChunks = Math.ceil(file.size / chunkSize);

        for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
          // Simular delay de upload
          await new Promise((resolve) => setTimeout(resolve, 100));

          const progress = Math.round(((chunkIdx + 1) / totalChunks) * 100);
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex ? { ...f, progress } : f
            )
          );
        }

        // Atualizar status para processing
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "processing", progress: 100 } : f
          )
        );

        // Simular análise
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Atualizar status para success
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "success" } : f
          )
        );

        // Atualizar progresso total
        const completedCount = i + 1;
        setTotalProgress(Math.round((completedCount / selectedFiles.length) * 100));
      }
    } catch (error) {
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
        <h2 className="text-2xl font-bold">Processamento em Batch</h2>
        <p className="text-gray-600">
          Selecione múltiplos arquivos para análise simultânea
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-6 border-2 border-dashed border-blue-300 bg-blue-50">
        <label className="flex flex-col items-center justify-center cursor-pointer space-y-3">
          <div className="text-4xl">📁</div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              Clique ou arraste arquivos aqui
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOCX, DOC, TXT, HTML (máx 100MB total)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt,.html"
            onChange={handleFileSelect}
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
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700"
            >
              Limpar Tudo
            </Button>
          </div>

          {/* File Items */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={file.selected}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                    disabled={isProcessing || file.status === "success"}
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
                {file.status === "uploading" || file.status === "processing" ? (
                  <div className="w-24 mr-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${file.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {file.progress}%
                    </p>
                  </div>
                ) : null}

                {/* Remove Button */}
                {file.status !== "uploading" && file.status !== "processing" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress Bar Total */}
      {isProcessing && (
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Progresso Total</p>
            <p className="text-sm font-bold text-blue-600">{totalProgress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={handleClearAll}
          disabled={isProcessing || files.length === 0}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleProcessBatch}
          disabled={isProcessing || selectedCount === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando ({totalProgress}%)
            </>
          ) : (
            <>
              Processar {selectedCount > 0 ? `(${selectedCount})` : ""}
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      {files.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{selectedCount}</span> arquivo(s)
            selecionado(s) • Tamanho total:{" "}
            <span className="font-semibold">{formatFileSize(selectedSize)}</span>
          </p>
        </Card>
      )}
    </div>
  );
}
