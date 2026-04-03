import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, datetime, decimal, index, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Analysis tables
export const analyses = mysqlTable(
  'analyses',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: int('user_id').notNull(),
    processNumber: varchar('process_number', { length: 50 }),
    documentName: varchar('document_name', { length: 255 }).notNull(),
    documentSize: int('document_size'),
    ocrMethod: mysqlEnum('ocr_method', ['native', 'tesseract', 'paddle', 'unknown']).default('unknown'),
    ocrConfidence: decimal('ocr_confidence', { precision: 3, scale: 2 }),
    extractedText: text('extracted_text'),
    maskedText: text('masked_text'),
    extractedDates: text('extracted_dates'),
    extractedValues: text('extracted_values'),
    extractedEntities: text('extracted_entities'),
    prescriptionStatus: mysqlEnum('prescription_status', ['ADMISSIBLE', 'REQUIRES_REVIEW', 'INADMISSIBLE', 'UNKNOWN']).default('UNKNOWN'),
    prescriptionDate: timestamp('prescription_date'),
    daysRemaining: int('days_remaining'),
    compliant: int('compliant'),
    complianceIssues: text('compliance_issues'),
    complianceRecommendations: text('compliance_recommendations'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    processingTimeMs: int('processing_time_ms'),
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

export const prescriptionAlerts = mysqlTable(
  'prescription_alerts',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: int('user_id').notNull(),
    analysisId: varchar('analysis_id', { length: 36 }).notNull(),
    processNumber: varchar('process_number', { length: 50 }).notNull(),
    prescriptionDate: timestamp('prescription_date').notNull(),
    daysRemaining: int('days_remaining').notNull(),
    alertType: mysqlEnum('alert_type', ['URGENT', 'WARNING', 'INFO']).default('INFO'),
    dismissed: tinyint('dismissed').default(0),
    dismissedAt: timestamp('dismissed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    analysisIdIdx: index('analysis_id_idx').on(table.analysisId),
    prescriptionDateIdx: index('prescription_date_idx').on(table.prescriptionDate),
    alertTypeIdx: index('alert_type_idx').on(table.alertType),
  })
);

export const organizationStats = mysqlTable(
  'organization_stats',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: int('user_id').notNull(),
    organizationName: varchar('organization_name', { length: 255 }).notNull(),
    totalAnalyses: int('total_analyses').default(0),
    totalProcesses: int('total_processes').default(0),
    totalValue: int('total_value').default(0),
    admissibleCount: int('admissible_count').default(0),
    requiresReviewCount: int('requires_review_count').default(0),
    prescribedCount: int('prescribed_count').default(0),
    lastAnalysisAt: timestamp('last_analysis_at'),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    organizationNameIdx: index('organization_name_idx').on(table.organizationName),
  })
);

export const exportedReports = mysqlTable(
  'exported_reports',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: int('user_id').notNull(),
    analysisIds: text('analysis_ids'),
    reportType: mysqlEnum('report_type', ['PDF', 'EXCEL', 'CSV']).default('PDF'),
    reportName: varchar('report_name', { length: 255 }).notNull(),
    reportUrl: text('report_url'),
    fileSize: int('file_size'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);

// Types
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
export type PrescriptionAlert = typeof prescriptionAlerts.$inferSelect;
export type InsertPrescriptionAlert = typeof prescriptionAlerts.$inferInsert;
export type OrganizationStat = typeof organizationStats.$inferSelect;
export type InsertOrganizationStat = typeof organizationStats.$inferInsert;
export type ExportedReport = typeof exportedReports.$inferSelect;
export type InsertExportedReport = typeof exportedReports.$inferInsert;