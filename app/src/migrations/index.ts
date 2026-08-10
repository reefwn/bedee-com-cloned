import * as migration_20260723_173814_initial from './20260723_173814_initial';
import * as migration_20260724_030357_live_content_poc from './20260724_030357_live_content_poc';
import * as migration_20260724_041943_homepage_blocks from './20260724_041943_homepage_blocks';
import * as migration_20260806_083203_add_ai_seo_fields from './20260806_083203_add_ai_seo_fields';
import * as migration_20260807_093154_add_post_references from './20260807_093154_add_post_references';
import * as migration_20260808_003713_add_article_grid_category_slug from './20260808_003713_add_article_grid_category_slug';
import * as migration_20260808_052729_add_image_carousel_block from './20260808_052729_add_image_carousel_block';
import * as migration_20260808_060625_add_hero_carousel_variant from './20260808_060625_add_hero_carousel_variant';
import * as migration_20260808_145632_add_promotion_grid_block from './20260808_145632_add_promotion_grid_block';
import * as migration_20260810_042634_add_hero_carousel_coral_variant from './20260810_042634_add_hero_carousel_coral_variant';
import * as migration_20260810_073050_add_promo_banner_subheading_icons from './20260810_073050_add_promo_banner_subheading_icons';
import * as migration_20260810_081744_add_product_carousel_block from './20260810_081744_add_product_carousel_block';
import * as migration_20260810_082024_add_product_carousel_icon from './20260810_082024_add_product_carousel_icon';

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
    name: '20260807_093154_add_post_references',
  },
  {
    up: migration_20260808_003713_add_article_grid_category_slug.up,
    down: migration_20260808_003713_add_article_grid_category_slug.down,
    name: '20260808_003713_add_article_grid_category_slug',
  },
  {
    up: migration_20260808_052729_add_image_carousel_block.up,
    down: migration_20260808_052729_add_image_carousel_block.down,
    name: '20260808_052729_add_image_carousel_block',
  },
  {
    up: migration_20260808_060625_add_hero_carousel_variant.up,
    down: migration_20260808_060625_add_hero_carousel_variant.down,
    name: '20260808_060625_add_hero_carousel_variant',
  },
  {
    up: migration_20260808_145632_add_promotion_grid_block.up,
    down: migration_20260808_145632_add_promotion_grid_block.down,
    name: '20260808_145632_add_promotion_grid_block',
  },
  {
    up: migration_20260810_042634_add_hero_carousel_coral_variant.up,
    down: migration_20260810_042634_add_hero_carousel_coral_variant.down,
    name: '20260810_042634_add_hero_carousel_coral_variant',
  },
  {
    up: migration_20260810_073050_add_promo_banner_subheading_icons.up,
    down: migration_20260810_073050_add_promo_banner_subheading_icons.down,
    name: '20260810_073050_add_promo_banner_subheading_icons',
  },
  {
    up: migration_20260810_081744_add_product_carousel_block.up,
    down: migration_20260810_081744_add_product_carousel_block.down,
    name: '20260810_081744_add_product_carousel_block',
  },
  {
    up: migration_20260810_082024_add_product_carousel_icon.up,
    down: migration_20260810_082024_add_product_carousel_icon.down,
    name: '20260810_082024_add_product_carousel_icon'
  },
];
