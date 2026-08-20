import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_trust_checklist_cta_variant" AS ENUM('outline', 'solid');
  CREATE TYPE "public"."enum__pages_v_blocks_trust_checklist_cta_variant" AS ENUM('outline', 'solid');
  ALTER TABLE "pages_blocks_trust_checklist" ADD COLUMN "cta_variant" "enum_pages_blocks_trust_checklist_cta_variant" DEFAULT 'outline';
  ALTER TABLE "pages_blocks_trust_checklist" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "pages_blocks_trust_checklist" ADD COLUMN "secondary_cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_trust_checklist" ADD COLUMN "cta_variant" "enum__pages_v_blocks_trust_checklist_cta_variant" DEFAULT 'outline';
  ALTER TABLE "_pages_v_blocks_trust_checklist" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_trust_checklist" ADD COLUMN "secondary_cta_url" varchar;

  CREATE TABLE "pages_blocks_promo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_promo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_promo_strip" ADD CONSTRAINT "pages_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip" ADD CONSTRAINT "pages_blocks_promo_strip_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip" ADD CONSTRAINT "_pages_v_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip" ADD CONSTRAINT "_pages_v_blocks_promo_strip_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "pages_blocks_promo_strip_order_idx" ON "pages_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_parent_id_idx" ON "pages_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_path_idx" ON "pages_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_promo_strip_locale_idx" ON "pages_blocks_promo_strip" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_icon_idx" ON "pages_blocks_promo_strip" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_order_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_parent_id_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_path_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_strip_locale_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_icon_idx" ON "_pages_v_blocks_promo_strip" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_trust_checklist" DROP COLUMN "cta_variant";
  ALTER TABLE "pages_blocks_trust_checklist" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "pages_blocks_trust_checklist" DROP COLUMN "secondary_cta_url";
  ALTER TABLE "_pages_v_blocks_trust_checklist" DROP COLUMN "cta_variant";
  ALTER TABLE "_pages_v_blocks_trust_checklist" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "_pages_v_blocks_trust_checklist" DROP COLUMN "secondary_cta_url";
  DROP TYPE "public"."enum_pages_blocks_trust_checklist_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_trust_checklist_cta_variant";
  DROP TABLE "pages_blocks_promo_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip" CASCADE;`)
}
