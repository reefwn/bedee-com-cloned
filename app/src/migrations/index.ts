import * as migration_20260723_173814_initial from './20260723_173814_initial';
import * as migration_20260724_030357_live_content_poc from './20260724_030357_live_content_poc';
import * as migration_20260724_041943_homepage_blocks from './20260724_041943_homepage_blocks';
import * as migration_20260806_083203_add_ai_seo_fields from './20260806_083203_add_ai_seo_fields';
import * as migration_20260807_093154_add_post_references from './20260807_093154_add_post_references';

export const migrations = [
  {
    up: migration_20260723_173814_initial.up,
    down: migration_20260723_173814_initial.down,
    name: '20260723_173814_initial',
  },
  {
    up: migration_20260724_030357_live_content_poc.up,
    down: migration_20260724_030357_live_content_poc.down,
    name: '20260724_030357_live_content_poc',
  },
  {
    up: migration_20260724_041943_homepage_blocks.up,
    down: migration_20260724_041943_homepage_blocks.down,
    name: '20260724_041943_homepage_blocks',
  },
  {
    up: migration_20260806_083203_add_ai_seo_fields.up,
    down: migration_20260806_083203_add_ai_seo_fields.down,
    name: '20260806_083203_add_ai_seo_fields',
  },
  {
    up: migration_20260807_093154_add_post_references.up,
    down: migration_20260807_093154_add_post_references.down,
    name: '20260807_093154_add_post_references'
  },
];
