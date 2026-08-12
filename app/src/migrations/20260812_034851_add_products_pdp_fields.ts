import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_key_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_usage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_warnings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "slug" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "short_description" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_highlights" ADD CONSTRAINT "products_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_key_ingredients" ADD CONSTRAINT "products_key_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_usage" ADD CONSTRAINT "products_usage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_warnings" ADD CONSTRAINT "products_warnings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_highlights_order_idx" ON "products_highlights" USING btree ("_order");
  CREATE INDEX "products_highlights_parent_id_idx" ON "products_highlights" USING btree ("_parent_id");
  CREATE INDEX "products_highlights_locale_idx" ON "products_highlights" USING btree ("_locale");
  CREATE INDEX "products_key_ingredients_order_idx" ON "products_key_ingredients" USING btree ("_order");
  CREATE INDEX "products_key_ingredients_parent_id_idx" ON "products_key_ingredients" USING btree ("_parent_id");
  CREATE INDEX "products_key_ingredients_locale_idx" ON "products_key_ingredients" USING btree ("_locale");
  CREATE INDEX "products_usage_order_idx" ON "products_usage" USING btree ("_order");
  CREATE INDEX "products_usage_parent_id_idx" ON "products_usage" USING btree ("_parent_id");
  CREATE INDEX "products_usage_locale_idx" ON "products_usage" USING btree ("_locale");
  CREATE INDEX "products_warnings_order_idx" ON "products_warnings" USING btree ("_order");
  CREATE INDEX "products_warnings_parent_id_idx" ON "products_warnings" USING btree ("_parent_id");
  CREATE INDEX "products_warnings_locale_idx" ON "products_warnings" USING btree ("_locale");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_key_ingredients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_usage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_warnings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_highlights" CASCADE;
  DROP TABLE "products_key_ingredients" CASCADE;
  DROP TABLE "products_usage" CASCADE;
  DROP TABLE "products_warnings" CASCADE;
  DROP INDEX "products_slug_idx";
  ALTER TABLE "products" DROP COLUMN "slug";
  ALTER TABLE "products_locales" DROP COLUMN "short_description";
  ALTER TABLE "products_locales" DROP COLUMN "description";`)
}
