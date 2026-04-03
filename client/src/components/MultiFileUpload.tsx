import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Upload, X, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
}

export function MultiFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = trpc.upload.processBatch.useMutation();
  const configQuery = trpc.upload.getConfig.useQuery();

  const config = configQuery.data;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles].slice(0, config?.maxFiles || 15));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const fileObjects = await Promise.all(
        files.map(async (file) => {
          const input = fileInputRef.current;
          if (!input?.files) return null;

          const actualFile = Array.from(input.files).find(
            (f) => f.name === file.name
          );
          if (!actualFile) return null;

          const buffer = await actualFile.arrayBuffer();
          return {
            name: actualFile.name,
            size: actualFile.size,
            type: actualFile.type,
            buffer: new Uint8Array(buffer),
          };
        })
      );

      const validFiles = fileObjects.filter(
        (f) => f !== null
      ) as typeof fileObjects;

      await uploadMutation.mutateAsync({
        files: validFiles as any,
      });
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Upload de Documentos</h2>

        {/* Área de Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Formatos suportados: PDF, DOCX, DOC, TXT, HTML
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Máximo {config?.maxFiles} arquivos, {config?.maxTotalSizeMB}MB total
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Selecionar Arquivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.html"
          />
        </div>

        {/* Lista de Arquivos */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Arquivos Selecionados ({files.length})
            </h3>

            <div className="space-y-2 mb-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm">
                <strong>Total:</strong> {files.length} arquivo(s) -{" "}
                {totalSizeMB}MB
              </p>
            </div>

            {/* Avisos */}
            {totalSize > (config?.maxTotalSize || 100 * 1024 * 1024) && (
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">
                  Tamanho total excede o limite de{" "}
                  {config?.maxTotalSizeMB}MB
                </span>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={
                  uploadMutation.isPending ||
                  totalSize > (config?.maxTotalSize || 100 * 1024 * 1024)
                }
                className="flex-1"
              >
                {uploadMutation.isPending
                  ? "Enviando..."
                  : `Enviar ${files.length} Arquivo(s)`}
              </Button>
              <Button
                onClick={() => setFiles([])}
                variant="outline"
                disabled={uploadMutation.isPending}
              >
                Limpar
              </Button>
            </div>

            {/* Resultado */}
            {uploadMutation.data && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-800">
                    Upload Concluído!
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  {uploadMutation.data.successfulUploads} de{" "}
                  {uploadMutation.data.totalFiles} arquivo(s) enviado(s) com
                  sucesso
                </p>
              </div>
            )}

            {/* Erros */}
            {uploadMutation.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="font-semibold text-red-800">Erro no Upload</p>
                </div>
                <p className="text-sm text-red-700">
                  {uploadMutation.error.message}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
