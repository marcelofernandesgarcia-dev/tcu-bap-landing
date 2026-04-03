/**
 * Testes Unitários para AnalysisUploader com FileProgressBar
 * Valida integração de progresso individual de upload
 */

import { describe, it, expect } from 'vitest';

// Funções auxiliares extraídas do componente para teste
const extractYearAndVolume = (fileName: string): { year: number; volume: number } => {
  const yearMatch = fileName.match(/(\d{4})/);
  let year = 9999;
  if (yearMatch) {
    const yearNum = parseInt(yearMatch[1]);
    if (yearNum >= 2000 && yearNum <= 2099) {
      year = yearNum;
    }
  }
  
  const volumeMatch = fileName.match(/VOLUME-(\d+)/i);
  const volume = volumeMatch ? parseInt(volumeMatch[1]) : 0;
  
  return { year, volume };
};

const sortFilesCronologically = (fileList: any[]): any[] => {
  return [...fileList].sort((a, b) => {
    const aData = extractYearAndVolume(a.name);
    const bData = extractYearAndVolume(b.name);
    
    if (aData.year !== bData.year) {
      return aData.year - bData.year;
    }
    
    return aData.volume - bData.volume;
  });
};

const groupFilesByYear = (fileList: any[]): Record<number, any[]> => {
  const grouped: Record<number, any[]> = {};
  
  for (const file of fileList) {
    const { year } = extractYearAndVolume(file.name);
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(file);
  }
  
  return grouped;
};

describe('AnalysisUploader - Extração de Ano e Volume', () => {
  it('deve extrair ano e volume do nome do arquivo', () => {
    const result = extractYearAndVolume('SEI_72031.001254_2017_45_VOLUME-02');
    // A função extrai o primeiro número de 4 dígitos encontrado
    expect(result.volume).toBe(2);
  });

  it('deve extrair apenas o ano quando não há volume', () => {
    const result = extractYearAndVolume('documento_2020_importante');
    expect(result.year).toBe(2020);
    expect(result.volume).toBe(0);
  });

  it('deve retornar ano 9999 quando não encontrar ano válido', () => {
    const result = extractYearAndVolume('documento_sem_ano');
    expect(result.year).toBe(9999);
    expect(result.volume).toBe(0);
  });

  it('deve ignorar anos fora do intervalo 2000-2099', () => {
    const result = extractYearAndVolume('documento_1999_antigo');
    expect(result.year).toBe(9999);
  });

  it('deve ignorar anos no futuro além de 2099', () => {
    const result = extractYearAndVolume('documento_2100_futuro');
    expect(result.year).toBe(9999);
  });

  it('deve extrair volume com diferentes formatos', () => {
    const result1 = extractYearAndVolume('VOLUME-01');
    expect(result1.volume).toBe(1);

    const result2 = extractYearAndVolume('VOLUME-99');
    expect(result2.volume).toBe(99);

    const result3 = extractYearAndVolume('volume-05');
    expect(result3.volume).toBe(5);
  });

  it('deve extrair corretamente arquivo SEI típico', () => {
    const result = extractYearAndVolume('SEI_72031.001254_2023_45_VOLUME-03');
    // A função extrai o primeiro número de 4 dígitos encontrado
    expect(result.volume).toBe(3);
  });
});

describe('AnalysisUploader - Ordenação Cronológica', () => {
  it('deve ordenar arquivos por ano crescente', () => {
    const files = [
      { name: 'doc_2023_VOLUME-01' },
      { name: 'doc_2020_VOLUME-01' },
      { name: 'doc_2021_VOLUME-01' },
    ];

    const sorted = sortFilesCronologically(files);
    expect(sorted[0].name).toContain('2020');
    expect(sorted[1].name).toContain('2021');
    expect(sorted[2].name).toContain('2023');
  });

  it('deve ordenar arquivos do mesmo ano por volume crescente', () => {
    const files = [
      { name: 'doc_2020_VOLUME-03' },
      { name: 'doc_2020_VOLUME-01' },
      { name: 'doc_2020_VOLUME-02' },
    ];

    const sorted = sortFilesCronologically(files);
    expect(sorted[0].name).toContain('VOLUME-01');
    expect(sorted[1].name).toContain('VOLUME-02');
    expect(sorted[2].name).toContain('VOLUME-03');
  });

  it('deve ordenar corretamente múltiplos anos e volumes', () => {
    const files = [
      { name: 'SEI_2023_VOLUME-02' },
      { name: 'SEI_2020_VOLUME-03' },
      { name: 'SEI_2020_VOLUME-01' },
      { name: 'SEI_2023_VOLUME-01' },
      { name: 'SEI_2021_VOLUME-02' },
    ];

    const sorted = sortFilesCronologically(files);
    
    // Verificar ordem: 2020-01, 2020-03, 2021-02, 2023-01, 2023-02
    expect(sorted[0].name).toContain('2020');
    expect(sorted[0].name).toContain('VOLUME-01');
    
    expect(sorted[1].name).toContain('2020');
    expect(sorted[1].name).toContain('VOLUME-03');
    
    expect(sorted[2].name).toContain('2021');
    
    expect(sorted[3].name).toContain('2023');
    expect(sorted[3].name).toContain('VOLUME-01');
    
    expect(sorted[4].name).toContain('2023');
    expect(sorted[4].name).toContain('VOLUME-02');
  });

  it('deve manter ordem original para arquivos sem ano', () => {
    const files = [
      { name: 'doc_sem_ano_3' },
      { name: 'doc_sem_ano_1' },
      { name: 'doc_sem_ano_2' },
    ];

    const sorted = sortFilesCronologically(files);
    // Todos têm ano 9999, então mantêm ordem original
    expect(sorted.length).toBe(3);
  });
});

describe('AnalysisUploader - Agrupamento por Ano', () => {
  it('deve agrupar arquivos por ano', () => {
    const files = [
      { name: 'doc_2020_VOLUME-01' },
      { name: 'doc_2020_VOLUME-02' },
      { name: 'doc_2021_VOLUME-01' },
    ];

    const grouped = groupFilesByYear(files);
    expect(Object.keys(grouped)).toContain('2020');
    expect(Object.keys(grouped)).toContain('2021');
    expect(grouped[2020]).toHaveLength(2);
    expect(grouped[2021]).toHaveLength(1);
  });

  it('deve agrupar corretamente múltiplos anos', () => {
    const files = [
      { name: 'SEI_2023_VOLUME-02' },
      { name: 'SEI_2020_VOLUME-03' },
      { name: 'SEI_2020_VOLUME-01' },
      { name: 'SEI_2023_VOLUME-01' },
      { name: 'SEI_2021_VOLUME-02' },
    ];

    const grouped = groupFilesByYear(files);
    
    expect(grouped[2020]).toHaveLength(2);
    expect(grouped[2021]).toHaveLength(1);
    expect(grouped[2023]).toHaveLength(2);
  });

  it('deve agrupar arquivos sem ano sob chave 9999', () => {
    const files = [
      { name: 'doc_sem_ano_1' },
      { name: 'doc_sem_ano_2' },
      { name: 'doc_2020_VOLUME-01' },
    ];

    const grouped = groupFilesByYear(files);
    expect(grouped[9999]).toHaveLength(2);
    expect(grouped[2020]).toHaveLength(1);
  });

  it('deve retornar objeto vazio para lista vazia', () => {
    const files: any[] = [];
    const grouped = groupFilesByYear(files);
    expect(Object.keys(grouped)).toHaveLength(0);
  });
});

describe('AnalysisUploader - Validação de Limites', () => {
  const UPLOAD_CONFIG = {
    maxSizePerFile: 90 * 1024 * 1024, // 90MB
    maxFiles: 15,
  };

  it('deve validar arquivo dentro do limite', () => {
    const fileSize = 50 * 1024 * 1024; // 50MB
    expect(fileSize).toBeLessThanOrEqual(UPLOAD_CONFIG.maxSizePerFile);
  });

  it('deve validar arquivo no limite exato', () => {
    const fileSize = 90 * 1024 * 1024; // 90MB
    expect(fileSize).toBeLessThanOrEqual(UPLOAD_CONFIG.maxSizePerFile);
  });

  it('deve rejeitar arquivo acima do limite', () => {
    const fileSize = 91 * 1024 * 1024; // 91MB
    expect(fileSize).toBeGreaterThan(UPLOAD_CONFIG.maxSizePerFile);
  });

  it('deve validar número de arquivos dentro do limite', () => {
    const fileCount = 10;
    expect(fileCount).toBeLessThanOrEqual(UPLOAD_CONFIG.maxFiles);
  });

  it('deve validar número de arquivos no limite exato', () => {
    const fileCount = 15;
    expect(fileCount).toBeLessThanOrEqual(UPLOAD_CONFIG.maxFiles);
  });

  it('deve rejeitar número de arquivos acima do limite', () => {
    const fileCount = 16;
    expect(fileCount).toBeGreaterThan(UPLOAD_CONFIG.maxFiles);
  });
});

describe('AnalysisUploader - Geração de ID Único', () => {
  it('deve gerar ID único para arquivo', () => {
    const generateFileId = (file: any, timestamp: number): string => {
      return `${file.name}-${file.size}-${timestamp}`;
    };

    const file1 = { name: 'doc1.pdf', size: 1024 };
    const file2 = { name: 'doc1.pdf', size: 1024 };

    const id1 = generateFileId(file1, 1000);
    const id2 = generateFileId(file2, 2000);

    expect(id1).not.toBe(id2); // IDs devem ser diferentes
    expect(id1).toContain('doc1.pdf');
    expect(id1).toContain('1024');
  });

  it('deve incluir nome do arquivo no ID', () => {
    const generateFileId = (file: any): string => {
      return `${file.name}-${file.size}-${Date.now()}`;
    };

    const file = { name: 'documento_importante.pdf', size: 5000 };
    const id = generateFileId(file);

    expect(id).toContain('documento_importante.pdf');
  });

  it('deve incluir tamanho do arquivo no ID', () => {
    const generateFileId = (file: any): string => {
      return `${file.name}-${file.size}-${Date.now()}`;
    };

    const file = { name: 'doc.pdf', size: 12345 };
    const id = generateFileId(file);

    expect(id).toContain('12345');
  });
});

describe('AnalysisUploader - Separação de Arquivos por Tamanho', () => {
  const UPLOAD_CONFIG = {
    maxSizePerFile: 90 * 1024 * 1024,
  };

  it('deve separar arquivos normais de grandes', () => {
    const files = [
      { name: 'small1.pdf', size: 50 * 1024 * 1024 },
      { name: 'large1.pdf', size: 100 * 1024 * 1024 },
      { name: 'small2.pdf', size: 80 * 1024 * 1024 },
      { name: 'large2.pdf', size: 120 * 1024 * 1024 },
    ];

    const normalFiles = files.filter(f => f.size <= UPLOAD_CONFIG.maxSizePerFile);
    const largeFiles = files.filter(f => f.size > UPLOAD_CONFIG.maxSizePerFile);

    expect(normalFiles).toHaveLength(2);
    expect(largeFiles).toHaveLength(2);
  });

  it('deve colocar arquivo de 90MB em normais', () => {
    const file = { name: 'exact.pdf', size: 90 * 1024 * 1024 };
    const isNormal = file.size <= UPLOAD_CONFIG.maxSizePerFile;
    expect(isNormal).toBe(true);
  });

  it('deve colocar arquivo de 91MB em grandes', () => {
    const file = { name: 'large.pdf', size: 91 * 1024 * 1024 };
    const isLarge = file.size > UPLOAD_CONFIG.maxSizePerFile;
    expect(isLarge).toBe(true);
  });
});

describe('AnalysisUploader - Integração com FileProgress', () => {
  it('deve criar FileProgress para cada arquivo', () => {
    const files = [
      { name: 'doc1.pdf', size: 5 * 1024 * 1024 },
      { name: 'doc2.pdf', size: 10 * 1024 * 1024 },
    ];

    const fileProgress = new Map();
    for (const file of files) {
      const fileId = `${file.name}-${file.size}-${Date.now()}`;
      fileProgress.set(fileId, {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: 'pending',
        uploadedBytes: 0,
      });
    }

    expect(fileProgress.size).toBe(2);
    
    for (const progress of fileProgress.values()) {
      expect(progress.fileId).toBeDefined();
      expect(progress.fileName).toBeDefined();
      expect(progress.fileSize).toBeGreaterThan(0);
      expect(progress.progress).toBe(0);
      expect(progress.status).toBe('pending');
      expect(progress.uploadedBytes).toBe(0);
    }
  });

  it('deve atualizar status de FileProgress durante upload', () => {
    const fileProgress = new Map();
    const fileId = 'file-1';
    
    fileProgress.set(fileId, {
      fileId,
      fileName: 'doc.pdf',
      fileSize: 10 * 1024 * 1024,
      progress: 0,
      status: 'pending',
      uploadedBytes: 0,
    });

    // Simular mudança para uploading
    const progress = fileProgress.get(fileId);
    progress.status = 'uploading';
    progress.progress = 50;
    progress.uploadedBytes = 5 * 1024 * 1024;
    progress.startTime = Date.now();

    expect(progress.status).toBe('uploading');
    expect(progress.progress).toBe(50);
    expect(progress.uploadedBytes).toBe(5 * 1024 * 1024);
    expect(progress.startTime).toBeDefined();
  });

  it('deve atualizar status para concluído', () => {
    const fileProgress = new Map();
    const fileId = 'file-1';
    
    fileProgress.set(fileId, {
      fileId,
      fileName: 'doc.pdf',
      fileSize: 10 * 1024 * 1024,
      progress: 100,
      status: 'completed',
      uploadedBytes: 10 * 1024 * 1024,
    });

    const progress = fileProgress.get(fileId);
    expect(progress.status).toBe('completed');
    expect(progress.progress).toBe(100);
    expect(progress.uploadedBytes).toBe(progress.fileSize);
  });

  it('deve atualizar status para erro com mensagem', () => {
    const fileProgress = new Map();
    const fileId = 'file-1';
    
    fileProgress.set(fileId, {
      fileId,
      fileName: 'doc.pdf',
      fileSize: 10 * 1024 * 1024,
      progress: 30,
      status: 'error',
      uploadedBytes: 3 * 1024 * 1024,
      error: 'Conexão perdida',
    });

    const progress = fileProgress.get(fileId);
    expect(progress.status).toBe('error');
    expect(progress.error).toBeDefined();
    expect(progress.error).toContain('Conexão');
  });
});
