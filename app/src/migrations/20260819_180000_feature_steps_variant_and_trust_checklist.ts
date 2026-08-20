import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_feature_steps_variant" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_steps_variant" AS ENUM('light', 'dark');
  ALTER TABLE "pages_blocks_feature_steps" ADD COLUMN "variant" "enum_pages_blocks_feature_steps_variant" DEFAULT 'light';
  ALTER TABLE "_pages_v_blocks_feature_steps" ADD COLUMN "variant" "enum__pages_v_blocks_feature_steps_variant" DEFAULT 'light';

  CREATE TABLE "pages_blocks_trust_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );

  CREATE TABLE "pages_blocks_trust_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_badge_label" varchar,
  	"image_badge_sub" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_trust_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_trust_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_badge_label" varchar,
  	"image_badge_sub" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_trust_checklist_items" ADD CONSTRAINT "pages_blocks_trust_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_checklist" ADD CONSTRAINT "pages_blocks_trust_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_checklist" ADD CONSTRAINT "pages_blocks_trust_checklist_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_checklist_items" ADD CONSTRAINT "_pages_v_blocks_trust_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_checklist" ADD CONSTRAINT "_pages_v_blocks_trust_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_checklist" ADD CONSTRAINT "_pages_v_blocks_trust_checklist_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "pages_blocks_trust_checklist_items_order_idx" ON "pages_blocks_trust_checklist_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_checklist_items_parent_id_idx" ON "pages_blocks_trust_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_checklist_items_locale_idx" ON "pages_blocks_trust_checklist_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_trust_checklist_order_idx" ON "pages_blocks_trust_checklist" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_checklist_parent_id_idx" ON "pages_blocks_trust_checklist" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_checklist_path_idx" ON "pages_blocks_trust_checklist" USING btree ("_path");
  CREATE INDEX "pages_blocks_trust_checklist_locale_idx" ON "pages_blocks_trust_checklist" USING btree ("_locale");
  CREATE INDEX "pages_blocks_trust_checklist_image_idx" ON "pages_blocks_trust_checklist" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_trust_checklist_items_order_idx" ON "_pages_v_blocks_trust_checklist_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_checklist_items_parent_id_idx" ON "_pages_v_blocks_trust_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_checklist_items_locale_idx" ON "_pages_v_blocks_trust_checklist_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_trust_checklist_order_idx" ON "_pages_v_blocks_trust_checklist" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_checklist_parent_id_idx" ON "_pages_v_blocks_trust_checklist" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_checklist_path_idx" ON "_pages_v_blocks_trust_checklist" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trust_checklist_locale_idx" ON "_pages_v_blocks_trust_checklist" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_trust_checklist_image_idx" ON "_pages_v_blocks_trust_checklist" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_steps" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_feature_steps" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_feature_steps_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_steps_variant";
  DROP TABLE "pages_blocks_trust_checklist_items" CASCADE;
  DROP TABLE "pages_blocks_trust_checklist" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_checklist_items" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_checklist" CASCADE;`)
}
