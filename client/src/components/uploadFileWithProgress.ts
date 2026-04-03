/**
 * Função para fazer upload de arquivo com rastreamento real de progresso
 * Usa XMLHttpRequest para monitorar eventos de progresso do upload
 */

export interface UploadProgressCallback {
  onProgress: (progress: number, uploadedBytes: number, totalBytes: number) => void;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

export async function uploadFileWithProgress(
  file: File,
  callbacks: UploadProgressCallback
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    // Rastrear progresso real do upload
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const uploadedBytes = event.loaded;
        const totalBytes = event.total;
        const progress = (uploadedBytes / totalBytes) * 100;

        callbacks.onProgress(progress, uploadedBytes, totalBytes);
      }
    });

    // Sucesso
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          callbacks.onComplete(result);
          resolve(result);
        } catch (err) {
          const error = 'Erro ao parsear resposta JSON';
          callbacks.onError(error);
          reject(new Error(error));
        }
      } else {
        const error = `HTTP ${xhr.status}`;
        callbacks.onError(error);
        reject(new Error(error));
      }
    });

    // Erro de rede
    xhr.addEventListener('error', () => {
      const error = 'Erro de rede durante upload';
      callbacks.onError(error);
      reject(new Error(error));
    });

    // Timeout
    xhr.addEventListener('timeout', () => {
      const error = 'Timeout durante upload';
      callbacks.onError(error);
      reject(new Error(error));
    });

    // Abort
    xhr.addEventListener('abort', () => {
      const error = 'Upload cancelado';
      callbacks.onError(error);
      reject(new Error(error));
    });

    // Configurar timeout (5 minutos para arquivos grandes)
    xhr.timeout = 300000;

    // Enviar
    xhr.open('POST', '/api/analyze');
    xhr.send(formData);
  });
}
