import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_steps_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );

  CREATE TABLE "pages_blocks_steps_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_steps_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_steps_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_steps_list_items" ADD CONSTRAINT "pages_blocks_steps_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_list" ADD CONSTRAINT "pages_blocks_steps_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_list" ADD CONSTRAINT "pages_blocks_steps_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_list_items" ADD CONSTRAINT "_pages_v_blocks_steps_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_list" ADD CONSTRAINT "_pages_v_blocks_steps_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_list" ADD CONSTRAINT "_pages_v_blocks_steps_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "pages_blocks_steps_list_items_order_idx" ON "pages_blocks_steps_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_list_items_parent_id_idx" ON "pages_blocks_steps_list_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_list_items_locale_idx" ON "pages_blocks_steps_list_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_list_order_idx" ON "pages_blocks_steps_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_list_parent_id_idx" ON "pages_blocks_steps_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_list_path_idx" ON "pages_blocks_steps_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_list_locale_idx" ON "pages_blocks_steps_list" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_list_image_idx" ON "pages_blocks_steps_list" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_steps_list_items_order_idx" ON "_pages_v_blocks_steps_list_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_list_items_parent_id_idx" ON "_pages_v_blocks_steps_list_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_list_items_locale_idx" ON "_pages_v_blocks_steps_list_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_list_order_idx" ON "_pages_v_blocks_steps_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_list_parent_id_idx" ON "_pages_v_blocks_steps_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_list_path_idx" ON "_pages_v_blocks_steps_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_list_locale_idx" ON "_pages_v_blocks_steps_list" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_list_image_idx" ON "_pages_v_blocks_steps_list" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_steps_list_items" CASCADE;
  DROP TABLE "pages_blocks_steps_list" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_list" CASCADE;`)
}
