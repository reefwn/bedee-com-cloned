import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_doctors_role" ADD VALUE 'specialist' BEFORE 'pharmacist';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors" ALTER COLUMN "role" SET DATA TYPE text;
  DROP TYPE "public"."enum_doctors_role";
  CREATE TYPE "public"."enum_doctors_role" AS ENUM('doctor', 'pharmacist');
  ALTER TABLE "doctors" ALTER COLUMN "role" SET DATA TYPE "public"."enum_doctors_role" USING "role"::"public"."enum_doctors_role";`)
}
