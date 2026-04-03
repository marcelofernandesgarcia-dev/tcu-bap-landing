import { getDb } from '../db';
import { analyses, prescriptionAlerts, organizationStats, exportedReports } from '../../drizzle/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function createAnalysis(data: any) {
  const id = nanoid();
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(analyses).values({ id, ...data } as any);
  return { id, ...data };
}

export async function getAnalyses(userId: number, { limit = 10, offset = 0 } = {}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const items = await db
    .select()
    .from(analyses)
    .where(eq(analyses.userId, userId))
    .orderBy(desc(analyses.createdAt))
    .limit(limit)
    .offset(offset);
  return { items, total: items.length, limit, offset };
}

export async function getPrescriptionAlerts(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db
    .select()
    .from(prescriptionAlerts)
    .where(eq(prescriptionAlerts.userId, userId))
    .orderBy(asc(prescriptionAlerts.daysRemaining));
}

export async function dismissAlert(alertId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db
    .update(prescriptionAlerts)
    .set({ dismissed: 1, dismissedAt: new Date() } as any)
    .where(eq(prescriptionAlerts.id, alertId));
}

export async function getOrganizationStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db
    .select()
    .from(organizationStats)
    .where(eq(organizationStats.userId, userId));
}

export async function createExportedReport(data: any) {
  const id = nanoid();
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(exportedReports).values({ id, ...data } as any);
  return { id, ...data };
}
