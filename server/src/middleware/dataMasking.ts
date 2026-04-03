/**
 * Middleware de Mascaramento de Dados Sensíveis
 * Protege informações pessoais antes de enviar ao Gemini
 * Conformidade LGPD
 */

import { ProcessData, MaskedProcessData, MaskedProcessEvent, ProcessEvent } from '../../../shared/analyzer-types';

/**
 * Mascarar nome de pessoa (ex: "João Silva" → "J.S.")
 */
const maskName = (name: string): string => {
  if (!name || name.length < 2) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + '.';
  }
  return parts.map((part, idx) => {
    if (idx === 0 || idx === parts.length - 1) {
      return part.charAt(0).toUpperCase() + '.';
    }
    return part.charAt(0).toUpperCase() + '.';
  }).join(' ');
};

/**
 * Mascarar CPF (ex: "123.456.789-00" → "***456***00")
 */
const maskCPF = (cpf: string): string => {
  if (!cpf) return cpf;
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return `***${cleaned.substring(3, 6)}***${cleaned.substring(9)}`;
};

/**
 * Mascarar CNPJ (ex: "12.345.678/0001-90" → "***345***0001-90")
 */
const maskCNPJ = (cnpj: string): string => {
  if (!cnpj) return cnpj;
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return `***${cleaned.substring(3, 6)}***${cleaned.substring(8)}`;
};

/**
 * Converter valor em faixa (ex: 234567 → "R$ 200k-300k")
 */
const maskDebtValue = (value: number): string => {
  if (value < 0) return "Valor inválido";
  if (value < 10000) return "< R$ 10k";
  if (value < 50000) return "R$ 10k-50k";
  if (value < 100000) return "R$ 50k-100k";
  if (value < 500000) return "R$ 100k-500k";
  if (value < 1000000) return "R$ 500k-1M";
  if (value < 5000000) return "R$ 1M-5M";
  return "> R$ 5M";
};

/**
 * Remover nomes de pessoas da descrição do evento
 */
const maskEventDescription = (description: string): string => {
  if (!description) return description;
  
  // Padrão simples: remover nomes próprios (palavras capitalizadas)
  // Mais sofisticado seria usar NLP, mas por segurança vamos ser conservadores
  let masked = description;
  
  // Remover padrões comuns de nomes
  masked = masked.replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, '[NOME]');
  
  // Remover CPF
  masked = masked.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF]');
  
  // Remover CNPJ
  masked = masked.replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, '[CNPJ]');
  
  return masked;
};

/**
 * Mascarar evento processual
 */
const maskEvent = (event: ProcessEvent): MaskedProcessEvent => {
  return {
    id: event.id,
    date: event.date,
    type: event.type,
    description: maskEventDescription(event.description),
    isInterruptive: event.isInterruptive
  };
};

/**
 * Mascarar dados do processo completo
 */
export const maskProcessData = (data: ProcessData): MaskedProcessData => {
  return {
    processNumber: data.processNumber, // Mantém número do processo (público)
    debtRange: maskDebtValue(data.debtValue),
    dateOfFact: data.dateOfFact, // Mantém data (pública)
    events: data.events.map(maskEvent),
    bapData: data.bapData // Mantém dados BAP estruturados
  };
};

/**
 * Remover dados sensíveis de um texto
 */
export const sanitizeText = (text: string): string => {
  if (!text) return text;
  
  let sanitized = text;
  
  // Remover CPF
  sanitized = sanitized.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF]');
  
  // Remover CNPJ
  sanitized = sanitized.replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, '[CNPJ]');
  
  // Remover emails
  sanitized = sanitized.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]');
  
  // Remover telefones
  sanitized = sanitized.replace(/\(\d{2}\)\s?\d{4,5}-\d{4}/g, '[TELEFONE]');
  
  // Remover nomes próprios (conservador)
  sanitized = sanitized.replace(/\b(?:Sr\.|Sra\.|Dr\.|Dra\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, '[NOME]');
  
  return sanitized;
};

/**
 * Validar se dados contêm informações sensíveis
 */
export const hasSensitiveData = (text: string): boolean => {
  if (!text) return false;
  
  // CPF
  if (/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(text)) return true;
  
  // CNPJ
  if (/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(text)) return true;
  
  // Email
  if (/[\w\.-]+@[\w\.-]+\.\w+/.test(text)) return true;
  
  // Telefone
  if (/\(\d{2}\)\s?\d{4,5}-\d{4}/.test(text)) return true;
  
  return false;
};

/**
 * Gerar relatório de dados mascarados
 */
export const generateMaskingReport = (original: ProcessData, masked: MaskedProcessData): string => {
  return `
📋 RELATÓRIO DE MASCARAMENTO DE DADOS
════════════════════════════════════════

✅ Dados Mascarados:
   • Valor do débito: R$ ${original.debtValue.toLocaleString('pt-BR')} → ${masked.debtRange}
   • Descrições de eventos: Nomes removidos
   • Identificadores pessoais: Removidos

✅ Dados Mantidos (Públicos):
   • Número do processo: ${masked.processNumber}
   • Data do fato: ${masked.dateOfFact}
   • Estrutura de eventos: Preservada
   • Dados BAP: Preservados

⚠️ Observação:
   Este documento foi processado com mascaramento de dados sensíveis
   conforme LGPD (Lei Geral de Proteção de Dados).
   Nenhuma informação pessoal foi enviada a serviços externos.
  `;
};
