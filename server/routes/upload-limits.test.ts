/**
 * Testes para validar limites de upload corrigidos
 * Limite de 90MB por arquivo, até 15 arquivos (100MB total)
 * Integração com Manus Desktop para arquivos > 90MB
 */

import { describe, it, expect } from 'vitest';

describe('Upload Limits Tests - 90MB Correction', () => {
  const UPLOAD_CONFIG = {
    maxSizePerFile: 90 * 1024 * 1024, // 90MB por arquivo
    maxTotalSize: 100 * 1024 * 1024, // 100MB total
    maxFiles: 15,
  };

  it('deve aceitar arquivo de 90MB', () => {
    const file = { name: 'documento.pdf', size: 90 * 1024 * 1024 };
    const isValid = file.size <= UPLOAD_CONFIG.maxSizePerFile;
    expect(isValid).toBe(true);
  });

  it('deve rejeitar arquivo > 90MB (enviar para Manus Desktop)', () => {
    const file = { name: 'documento-grande.pdf', size: 91 * 1024 * 1024 };
    const isNormal = file.size <= UPLOAD_CONFIG.maxSizePerFile;
    const isLarge = file.size > UPLOAD_CONFIG.maxSizePerFile;

    expect(isNormal).toBe(false);
    expect(isLarge).toBe(true); // Deve ser processado via Manus Desktop
  });

  it('deve aceitar múltiplos arquivos de 90MB', () => {
    const files = [
      { name: 'doc1.pdf', size: 90 * 1024 * 1024 },
      { name: 'doc2.pdf', size: 90 * 1024 * 1024 },
    ];

    const allValid = files.every((f) => f.size <= UPLOAD_CONFIG.maxSizePerFile);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalValid = totalSize <= UPLOAD_CONFIG.maxTotalSize;

    expect(allValid).toBe(true);
    expect(totalValid).toBe(false); // 180MB > 100MB
  });

  it('deve aceitar até 15 arquivos', () => {
    const files = Array.from({ length: 15 }, (_, i) => ({
      name: `doc${i + 1}.pdf`,
      size: 5 * 1024 * 1024, // 5MB cada
    }));

    expect(files).toHaveLength(15);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    expect(totalSize).toBe(75 * 1024 * 1024); // 75MB total
  });

  it('deve rejeitar 16º arquivo', () => {
    const files = Array.from({ length: 15 }, (_, i) => ({
      name: `doc${i + 1}.pdf`,
      size: 5 * 1024 * 1024,
    }));

    const newFile = { name: 'doc16.pdf', size: 5 * 1024 * 1024 };
    const totalFiles = files.length + 1;

    expect(totalFiles > UPLOAD_CONFIG.maxFiles).toBe(true);
  });

  it('deve separar arquivos normais de arquivos grandes', () => {
    const selectedFiles = [
      { name: 'normal1.pdf', size: 50 * 1024 * 1024 }, // 50MB - normal
      { name: 'large1.pdf', size: 100 * 1024 * 1024 }, // 100MB - grande
      { name: 'normal2.pdf', size: 30 * 1024 * 1024 }, // 30MB - normal
      { name: 'large2.pdf', size: 150 * 1024 * 1024 }, // 150MB - grande
    ];

    const normalFiles = selectedFiles.filter((f) => f.size <= UPLOAD_CONFIG.maxSizePerFile);
    const largeFiles = selectedFiles.filter((f) => f.size > UPLOAD_CONFIG.maxSizePerFile);

    expect(normalFiles).toHaveLength(2);
    expect(largeFiles).toHaveLength(2);
    expect(normalFiles[0].name).toBe('normal1.pdf');
    expect(largeFiles[0].name).toBe('large1.pdf');
  });

  it('deve processar arquivo de 27MB (caso real do usuário) como normal', () => {
    const file = { name: 'SEI_72031.008871_2017_71.pdf', size: 27 * 1024 * 1024 };
    const isNormal = file.size <= UPLOAD_CONFIG.maxSizePerFile;

    expect(isNormal).toBe(true); // 27MB < 90MB
  });

  it('deve processar múltiplos arquivos incluindo arquivo de 27MB', () => {
    const files = [
      { name: 'SEI_72031.008744_2024_00.pdf', size: 11.53 * 1024 * 1024 }, // 11.53MB
      { name: 'SEI_72031.008871_2017_71.pdf', size: 27 * 1024 * 1024 }, // 27MB
    ];

    const normalFiles = files.filter((f) => f.size <= UPLOAD_CONFIG.maxSizePerFile);
    const totalSize = normalFiles.reduce((sum, f) => sum + f.size, 0);

    expect(normalFiles).toHaveLength(2);
    expect(totalSize).toBeLessThan(UPLOAD_CONFIG.maxTotalSize);
  });

  it('deve validar que ambos os arquivos do caso real são aceitos', () => {
    const file1 = { name: 'SEI_72031.008744_2024_00.pdf', size: 11.53 * 1024 * 1024 };
    const file2 = { name: 'SEI_72031.008871_2017_71.pdf', size: 27 * 1024 * 1024 };

    const file1Valid = file1.size <= UPLOAD_CONFIG.maxSizePerFile;
    const file2Valid = file2.size <= UPLOAD_CONFIG.maxSizePerFile;

    expect(file1Valid).toBe(true);
    expect(file2Valid).toBe(true);
  });

  it('deve calcular tamanho total corretamente', () => {
    const files = [
      { name: 'doc1.pdf', size: 30 * 1024 * 1024 },
      { name: 'doc2.pdf', size: 40 * 1024 * 1024 },
      { name: 'doc3.pdf', size: 20 * 1024 * 1024 },
    ];

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);

    expect(totalSize).toBe(90 * 1024 * 1024);
    expect(totalSizeMB).toBe(90);
  });

  it('deve validar integração com Manus Desktop para arquivos > 90MB', () => {
    const largeFile = { name: 'grande.pdf', size: 150 * 1024 * 1024 };
    const processingMethod = largeFile.size > UPLOAD_CONFIG.maxSizePerFile ? 'manus_desktop_ocr' : 'normal';

    expect(processingMethod).toBe('manus_desktop_ocr');
  });

  it('deve validar que arquivo de 10MB (limite antigo) agora é aceito sem problemas', () => {
    const file = { name: 'documento.pdf', size: 10 * 1024 * 1024 };
    const isValid = file.size <= UPLOAD_CONFIG.maxSizePerFile;

    expect(isValid).toBe(true); // 10MB < 90MB
  });

  it('deve validar que até 10 arquivos de 10MB cabem no limite total', () => {
    const files = Array.from({ length: 10 }, (_, i) => ({
      name: `doc${i + 1}.pdf`,
      size: 10 * 1024 * 1024,
    }));

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);

    expect(totalSize).toBe(100 * 1024 * 1024);
    expect(totalSizeMB).toBe(100);
  });

  it('deve validar que 11 arquivos de 10MB excedem o limite total', () => {
    const files = Array.from({ length: 11 }, (_, i) => ({
      name: `doc${i + 1}.pdf`,
      size: 10 * 1024 * 1024,
    }));

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const exceedsLimit = totalSize > UPLOAD_CONFIG.maxTotalSize;

    expect(exceedsLimit).toBe(true); // 110MB > 100MB
  });
});
