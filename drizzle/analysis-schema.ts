/**
 * Schema do Banco de Dados para Histórico de Análises
 * Armazena resultados de análises de documentos TCE
 */

import { mysqlTable, varchar, text, int, decimal, datetime, enum as mysqlEnum, index, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/**
 * Tabela de análises realizadas
 */
export const analyses = mysqlTable(
  'analyses',
  {
    id: varchar('id', { length: 36 }).primaryKey(), // UUID
    userId: varchar('user_id', { length: 36 }).notNull(),
    processNumber: varchar('process_number', { length: 50 }),
    documentName: varchar('document_name', { length: 255 }).notNull(),
    documentSize: int('document_size'), // em bytes
    ocrMethod: mysqlEnum('ocr_method', ['native', 'tesseract', 'paddle', 'unknown']).default('unknown'),
    ocrConfidence: decimal('ocr_confidence', { precision: 3, scale: 2 }), // 0.00 - 1.00
    extractedText: text('extracted_text'), // Primeiros 5000 caracteres
    maskedText: text('masked_text'), // Texto com dados sensíveis mascarados
    
    // Campos estruturados extraídos
    extractedDates: text('extracted_dates'), // JSON array
    extractedValues: text('extracted_values'), // JSON array
    extractedEntities: text('extracted_entities'), // JSON array
    
    // Análise de prescrição
    prescriptionStatus: mysqlEnum('prescription_status', ['ADMISSIBLE', 'REQUIRES_REVIEW', 'INADMISSIBLE', 'UNKNOWN']).default('UNKNOWN'),
    prescriptionDate: datetime('prescription_date'),
    daysRemaining: int('days_remaining'),
    
    // Validação de conformidade
    compliant: int('compliant'), // 0 ou 1 (boolean)
    complianceIssues: text('compliance_issues'), // JSON array
    complianceRecommendations: text('compliance_recommendations'), // JSON array
    
    // Metadados
    createdAt: datetime('created_at').defaultNow(),
    updatedAt: datetime('updated_at').defaultNow(),
    processingTimeMs: int('processing_time_ms'), // Tempo de processamento em ms
    status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed']).default('pending'),
    errorMessage: text('error_message'),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    processNumberIdx: index('process_number_idx').on(table.processNumber),
    prescriptionStatusIdx: index('prescription_status_idx').on(table.prescriptionStatus),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);

/**
 * Tabela de alertas de prescrição
 */
export const prescriptionAlerts = mysqlTable(
  'prescription_alerts',
  {
    id: varchar('id', { length: 36 }).primaryKey(), // UUID
    userId: varchar('user_id', { length: 36 }).notNull(),
    analysisId: varchar('analysis_id', { length: 36 }).notNull(),
    processNumber: varchar('process_number', { length: 50 }).notNull(),
    prescriptionDate: datetime('prescription_date').notNull(),
    daysRemaining: int('days_remaining').notNull(),
    alertType: mysqlEnum('alert_type', ['URGENT', 'WARNING', 'INFO']).default('INFO'),
    dismissed: int('dismissed').default(0), // 0 ou 1 (boolean)
    dismissedAt: datetime('dismissed_at'),
    createdAt: datetime('created_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    analysisIdIdx: index('analysis_id_idx').on(table.analysisId),
    prescriptionDateIdx: index('prescription_date_idx').on(table.prescriptionDate),
    alertTypeIdx: index('alert_type_idx').on(table.alertType),
  })
);

/**
 * Tabela de estatísticas por órgão
 */
export const organizationStats = mysqlTable(
  'organization_stats',
  {
    id: varchar('id', { length: 36 }).primaryKey(), // UUID
    userId: varchar('user_id', { length: 36 }).notNull(),
    organizationName: varchar('organization_name', { length: 255 }).notNull(),
    totalAnalyses: int('total_analyses').default(0),
    totalProcesses: int('total_processes').default(0),
    totalValue: decimal('total_value', { precision: 15, scale: 2 }).default(0),
    admissibleCount: int('admissible_count').default(0),
    requiresReviewCount: int('requires_review_count').default(0),
    prescribedCount: int('prescribed_count').default(0),
    lastAnalysisAt: datetime('last_analysis_at'),
    updatedAt: datetime('updated_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    organizationNameIdx: index('organization_name_idx').on(table.organizationName),
  })
);

/**
 * Tabela de relatórios exportados
 */
export const exportedReports = mysqlTable(
  'exported_reports',
  {
    id: varchar('id', { length: 36 }).primaryKey(), // UUID
    userId: varchar('user_id', { length: 36 }).notNull(),
    analysisIds: text('analysis_ids'), // JSON array de IDs
    reportType: mysqlEnum('report_type', ['PDF', 'EXCEL', 'CSV']).default('PDF'),
    reportName: varchar('report_name', { length: 255 }).notNull(),
    reportUrl: text('report_url'), // URL para download
    fileSize: int('file_size'), // em bytes
    createdAt: datetime('created_at').defaultNow(),
    expiresAt: datetime('expires_at'), // Quando o link expira
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);

/**
 * Relações entre tabelas
 */
export const analysesRelations = relations(analyses, ({ many }) => ({
  alerts: many(prescriptionAlerts),
}));

export const prescriptionAlertsRelations = relations(prescriptionAlerts, ({ one }) => ({
  analysis: one(analyses, {
    fields: [prescriptionAlerts.analysisId],
    references: [analyses.id],
  }),
}));
