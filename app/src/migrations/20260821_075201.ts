import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_credential_strip_items" ADD COLUMN "issued_by" varchar;
  ALTER TABLE "pages_blocks_credential_strip_items" ADD COLUMN "identifier" varchar;
  ALTER TABLE "pages_blocks_credential_strip_items" ADD COLUMN "valid_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_credential_strip_items" ADD COLUMN "valid_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_credential_strip_items" ADD COLUMN "certificate_url" varchar;
  ALTER TABLE "_pages_v_blocks_credential_strip_items" ADD COLUMN "issued_by" varchar;
  ALTER TABLE "_pages_v_blocks_credential_strip_items" ADD COLUMN "identifier" varchar;
  ALTER TABLE "_pages_v_blocks_credential_strip_items" ADD COLUMN "valid_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_credential_strip_items" ADD COLUMN "valid_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_credential_strip_items" ADD COLUMN "certificate_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_credential_strip_items" DROP COLUMN "issued_by";
  ALTER TABLE "pages_blocks_credential_strip_items" DROP COLUMN "identifier";
  ALTER TABLE "pages_blocks_credential_strip_items" DROP COLUMN "valid_from";
  ALTER TABLE "pages_blocks_credential_strip_items" DROP COLUMN "valid_until";
  ALTER TABLE "pages_blocks_credential_strip_items" DROP COLUMN "certificate_url";
  ALTER TABLE "_pages_v_blocks_credential_strip_items" DROP COLUMN "issued_by";
  ALTER TABLE "_pages_v_blocks_credential_strip_items" DROP COLUMN "identifier";
  ALTER TABLE "_pages_v_blocks_credential_strip_items" DROP COLUMN "valid_from";
  ALTER TABLE "_pages_v_blocks_credential_strip_items" DROP COLUMN "valid_until";
  ALTER TABLE "_pages_v_blocks_credential_strip_items" DROP COLUMN "certificate_url";`)
}
