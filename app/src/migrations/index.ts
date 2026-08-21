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
import * as migration_20260811_030719_add_hero_carousel_teal_variant from './20260811_030719_add_hero_carousel_teal_variant';
import * as migration_20260811_050140_add_products_original_price from './20260811_050140_add_products_original_price';
import * as migration_20260812_034851_add_products_pdp_fields from './20260812_034851_add_products_pdp_fields';
import * as migration_20260813_052447_add_products_faqs from './20260813_052447_add_products_faqs';
import * as migration_20260813_054751_add_news_excerpt from './20260813_054751_add_news_excerpt';
import * as migration_20260813_083505_add_contact_submissions from './20260813_083505_add_contact_submissions';
import * as migration_20260813_093812_add_corporate_inquiries from './20260813_093812_add_corporate_inquiries';
import * as migration_20260813_151607_add_lead_status_fields from './20260813_151607_add_lead_status_fields';
import * as migration_20260817_060123_add_lead_ip_address from './20260817_060123_add_lead_ip_address';
import * as migration_20260819_172840_add_feature_steps_block from './20260819_172840_add_feature_steps_block';
import * as migration_20260819_174700_feature_steps_icon_no_cta from './20260819_174700_feature_steps_icon_no_cta';
import * as migration_20260819_180000_feature_steps_variant_and_trust_checklist from './20260819_180000_feature_steps_variant_and_trust_checklist';
import * as migration_20260820_050000_trust_checklist_cta_variant_and_promo_strip from './20260820_050000_trust_checklist_cta_variant_and_promo_strip';
import * as migration_20260820_070000_add_steps_list_block from './20260820_070000_add_steps_list_block';
import * as migration_20260820_072440_add_testimonials_service_type_and_date from './20260820_072440_add_testimonials_service_type_and_date';
import * as migration_20260820_080133_add_testimonial_grid_block from './20260820_080133_add_testimonial_grid_block';
import * as migration_20260821_065102 from './20260821_065102';
import * as migration_20260821_075201 from './20260821_075201';

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
    name: '20260810_082024_add_product_carousel_icon',
  },
  {
    up: migration_20260811_030719_add_hero_carousel_teal_variant.up,
    down: migration_20260811_030719_add_hero_carousel_teal_variant.down,
    name: '20260811_030719_add_hero_carousel_teal_variant',
  },
  {
    up: migration_20260811_050140_add_products_original_price.up,
    down: migration_20260811_050140_add_products_original_price.down,
    name: '20260811_050140_add_products_original_price',
  },
  {
    up: migration_20260812_034851_add_products_pdp_fields.up,
    down: migration_20260812_034851_add_products_pdp_fields.down,
    name: '20260812_034851_add_products_pdp_fields',
  },
  {
    up: migration_20260813_052447_add_products_faqs.up,
    down: migration_20260813_052447_add_products_faqs.down,
    name: '20260813_052447_add_products_faqs',
  },
  {
    up: migration_20260813_054751_add_news_excerpt.up,
    down: migration_20260813_054751_add_news_excerpt.down,
    name: '20260813_054751_add_news_excerpt',
  },
  {
    up: migration_20260813_083505_add_contact_submissions.up,
    down: migration_20260813_083505_add_contact_submissions.down,
    name: '20260813_083505_add_contact_submissions',
  },
  {
    up: migration_20260813_093812_add_corporate_inquiries.up,
    down: migration_20260813_093812_add_corporate_inquiries.down,
    name: '20260813_093812_add_corporate_inquiries',
  },
  {
    up: migration_20260813_151607_add_lead_status_fields.up,
    down: migration_20260813_151607_add_lead_status_fields.down,
    name: '20260813_151607_add_lead_status_fields',
  },
  {
    up: migration_20260817_060123_add_lead_ip_address.up,
    down: migration_20260817_060123_add_lead_ip_address.down,
    name: '20260817_060123_add_lead_ip_address',
  },
  {
    up: migration_20260819_172840_add_feature_steps_block.up,
    down: migration_20260819_172840_add_feature_steps_block.down,
    name: '20260819_172840_add_feature_steps_block',
  },
  {
    up: migration_20260819_174700_feature_steps_icon_no_cta.up,
    down: migration_20260819_174700_feature_steps_icon_no_cta.down,
    name: '20260819_174700_feature_steps_icon_no_cta',
  },
  {
    up: migration_20260819_180000_feature_steps_variant_and_trust_checklist.up,
    down: migration_20260819_180000_feature_steps_variant_and_trust_checklist.down,
    name: '20260819_180000_feature_steps_variant_and_trust_checklist',
  },
  {
    up: migration_20260820_050000_trust_checklist_cta_variant_and_promo_strip.up,
    down: migration_20260820_050000_trust_checklist_cta_variant_and_promo_strip.down,
    name: '20260820_050000_trust_checklist_cta_variant_and_promo_strip',
  },
  {
    up: migration_20260820_070000_add_steps_list_block.up,
    down: migration_20260820_070000_add_steps_list_block.down,
    name: '20260820_070000_add_steps_list_block',
  },
  {
    up: migration_20260820_072440_add_testimonials_service_type_and_date.up,
    down: migration_20260820_072440_add_testimonials_service_type_and_date.down,
    name: '20260820_072440_add_testimonials_service_type_and_date',
  },
  {
    up: migration_20260820_080133_add_testimonial_grid_block.up,
    down: migration_20260820_080133_add_testimonial_grid_block.down,
    name: '20260820_080133_add_testimonial_grid_block',
  },
  {
    up: migration_20260821_065102.up,
    down: migration_20260821_065102.down,
    name: '20260821_065102',
  },
  {
    up: migration_20260821_075201.up,
    down: migration_20260821_075201.down,
    name: '20260821_075201'
  },
];
