import * as migration_20260723_173814_initial from './20260723_173814_initial';
import * as migration_20260724_030357_live_content_poc from './20260724_030357_live_content_poc';
import * as migration_20260724_041943_homepage_blocks from './20260724_041943_homepage_blocks';

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
    name: '20260724_041943_homepage_blocks'
  },
];
