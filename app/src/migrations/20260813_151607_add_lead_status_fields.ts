import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'contacted', 'resolved');
  CREATE TYPE "public"."enum_corporate_inquiries_status" AS ENUM('new', 'contacted', 'resolved');
  ALTER TABLE "contact_submissions" ADD COLUMN "status" "enum_contact_submissions_status" DEFAULT 'new';
  ALTER TABLE "corporate_inquiries" ADD COLUMN "status" "enum_corporate_inquiries_status" DEFAULT 'new';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DROP COLUMN "status";
  ALTER TABLE "corporate_inquiries" DROP COLUMN "status";
  DROP TYPE "public"."enum_contact_submissions_status";
  DROP TYPE "public"."enum_corporate_inquiries_status";`)
}
