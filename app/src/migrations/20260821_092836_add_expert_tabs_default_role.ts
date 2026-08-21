import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_expert_tabs_default_role" AS ENUM('doctor', 'specialist', 'pharmacist');
  CREATE TYPE "public"."enum__pages_v_blocks_expert_tabs_default_role" AS ENUM('doctor', 'specialist', 'pharmacist');
  ALTER TABLE "pages_blocks_expert_tabs" ADD COLUMN "default_role" "enum_pages_blocks_expert_tabs_default_role" DEFAULT 'doctor';
  ALTER TABLE "_pages_v_blocks_expert_tabs" ADD COLUMN "default_role" "enum__pages_v_blocks_expert_tabs_default_role" DEFAULT 'doctor';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_expert_tabs" DROP COLUMN "default_role";
  ALTER TABLE "_pages_v_blocks_expert_tabs" DROP COLUMN "default_role";
  DROP TYPE "public"."enum_pages_blocks_expert_tabs_default_role";
  DROP TYPE "public"."enum__pages_v_blocks_expert_tabs_default_role";`)
}
