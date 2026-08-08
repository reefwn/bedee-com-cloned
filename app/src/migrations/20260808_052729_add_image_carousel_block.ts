import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_image_carousel_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_carousel_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_image_carousel_images" ADD CONSTRAINT "pages_blocks_image_carousel_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel_images" ADD CONSTRAINT "pages_blocks_image_carousel_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_carousel_images" ADD CONSTRAINT "_pages_v_blocks_image_carousel_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_carousel_images" ADD CONSTRAINT "_pages_v_blocks_image_carousel_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_carousel" ADD CONSTRAINT "_pages_v_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_carousel_images_order_idx" ON "pages_blocks_image_carousel_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_carousel_images_parent_id_idx" ON "pages_blocks_image_carousel_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_carousel_images_locale_idx" ON "pages_blocks_image_carousel_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_carousel_images_image_idx" ON "pages_blocks_image_carousel_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_carousel_order_idx" ON "pages_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_carousel_parent_id_idx" ON "pages_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_carousel_path_idx" ON "pages_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_carousel_locale_idx" ON "pages_blocks_image_carousel" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_carousel_images_order_idx" ON "_pages_v_blocks_image_carousel_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_carousel_images_parent_id_idx" ON "_pages_v_blocks_image_carousel_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_carousel_images_locale_idx" ON "_pages_v_blocks_image_carousel_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_carousel_images_image_idx" ON "_pages_v_blocks_image_carousel_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_carousel_order_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_carousel_parent_id_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_carousel_path_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_carousel_locale_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_image_carousel_images" CASCADE;
  DROP TABLE "pages_blocks_image_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_image_carousel_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_carousel" CASCADE;`)
}
