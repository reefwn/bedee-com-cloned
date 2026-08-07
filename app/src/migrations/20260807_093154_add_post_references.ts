import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "posts_references_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_references_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts_references" ADD CONSTRAINT "posts_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_references_locales" ADD CONSTRAINT "posts_references_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_references" ADD CONSTRAINT "_posts_v_version_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_references_locales" ADD CONSTRAINT "_posts_v_version_references_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_version_references"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_references_order_idx" ON "posts_references" USING btree ("_order");
  CREATE INDEX "posts_references_parent_id_idx" ON "posts_references" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_references_locales_locale_parent_id_unique" ON "posts_references_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_references_order_idx" ON "_posts_v_version_references" USING btree ("_order");
  CREATE INDEX "_posts_v_version_references_parent_id_idx" ON "_posts_v_version_references" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_version_references_locales_locale_parent_id_unique" ON "_posts_v_version_references_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_references" CASCADE;
  DROP TABLE "posts_references_locales" CASCADE;
  DROP TABLE "_posts_v_version_references" CASCADE;
  DROP TABLE "_posts_v_version_references_locales" CASCADE;`)
}
