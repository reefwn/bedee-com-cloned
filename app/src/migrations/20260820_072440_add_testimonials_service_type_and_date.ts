import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Note: migrate:create's rename-vs-create prompt replayed several prior
// migrations' columns as if they didn't exist yet (a snapshot-drift artifact
// from earlier hand-written migrations run outside this tool — see those
// migrations' own comments). The paired .json snapshot is kept as generated
// (it now reflects the true current schema for future diffing); this .ts
// file is hand-trimmed to just the real delta so it doesn't re-create
// columns/types/tables that already exist in the live DB.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_service_type" AS ENUM('delivery', 'teleconsult');
  ALTER TABLE "testimonials" ADD COLUMN "service_type" "enum_testimonials_service_type";
  ALTER TABLE "testimonials" ADD COLUMN "submitted_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DROP COLUMN "service_type";
  ALTER TABLE "testimonials" DROP COLUMN "submitted_at";
  DROP TYPE "public"."enum_testimonials_service_type";`)
}
