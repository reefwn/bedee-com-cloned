import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" ADD COLUMN "ip_address" varchar;
  ALTER TABLE "corporate_inquiries" ADD COLUMN "ip_address" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DROP COLUMN "ip_address";
  ALTER TABLE "corporate_inquiries" DROP COLUMN "ip_address";`)
}
