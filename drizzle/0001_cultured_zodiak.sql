CREATE TABLE `analyses` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`process_number` varchar(50),
	`document_name` varchar(255) NOT NULL,
	`document_size` int,
	`ocr_method` enum('native','tesseract','paddle','unknown') DEFAULT 'unknown',
	`ocr_confidence` decimal(3,2),
	`extracted_text` text,
	`masked_text` text,
	`extracted_dates` text,
	`extracted_values` text,
	`extracted_entities` text,
	`prescription_status` enum('ADMISSIBLE','REQUIRES_REVIEW','INADMISSIBLE','UNKNOWN') DEFAULT 'UNKNOWN',
	`prescription_date` timestamp,
	`days_remaining` int,
	`compliant` int,
	`compliance_issues` text,
	`compliance_recommendations` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`processing_time_ms` int,
	`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`error_message` text,
	CONSTRAINT `analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exported_reports` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`analysis_ids` text,
	`report_type` enum('PDF','EXCEL','CSV') DEFAULT 'PDF',
	`report_name` varchar(255) NOT NULL,
	`report_url` text,
	`file_size` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `exported_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_stats` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`organization_name` varchar(255) NOT NULL,
	`total_analyses` int DEFAULT 0,
	`total_processes` int DEFAULT 0,
	`total_value` int DEFAULT 0,
	`admissible_count` int DEFAULT 0,
	`requires_review_count` int DEFAULT 0,
	`prescribed_count` int DEFAULT 0,
	`last_analysis_at` timestamp,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organization_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescription_alerts` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`analysis_id` varchar(36) NOT NULL,
	`process_number` varchar(50) NOT NULL,
	`prescription_date` timestamp NOT NULL,
	`days_remaining` int NOT NULL,
	`alert_type` enum('URGENT','WARNING','INFO') DEFAULT 'INFO',
	`dismissed` int DEFAULT 0,
	`dismissed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prescription_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `analyses` (`user_id`);--> statement-breakpoint
CREATE INDEX `process_number_idx` ON `analyses` (`process_number`);--> statement-breakpoint
CREATE INDEX `prescription_status_idx` ON `analyses` (`prescription_status`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `analyses` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `exported_reports` (`user_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `exported_reports` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `organization_stats` (`user_id`);--> statement-breakpoint
CREATE INDEX `organization_name_idx` ON `organization_stats` (`organization_name`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `prescription_alerts` (`user_id`);--> statement-breakpoint
CREATE INDEX `analysis_id_idx` ON `prescription_alerts` (`analysis_id`);--> statement-breakpoint
CREATE INDEX `prescription_date_idx` ON `prescription_alerts` (`prescription_date`);--> statement-breakpoint
CREATE INDEX `alert_type_idx` ON `prescription_alerts` (`alert_type`);