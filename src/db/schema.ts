import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const analyticsEventType = pgEnum("analytics_event_type", [
  "page_view",
  "product_view",
  "category_click",
  "link_click",
  "whatsapp_click",
  "instagram_click",
  "maps_click",
  "share_click",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 120 }),
  ...timestamps,
});

export const themes = pgTable("themes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  config: jsonb("config_json").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 30 }).notNull().unique(),
    description: varchar("description", { length: 300 }),
    businessType: varchar("business_type", { length: 60 }),
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    whatsapp: varchar("whatsapp", { length: 30 }),
    instagram: varchar("instagram", { length: 100 }),
    address: text("address"),
    mapsUrl: text("maps_url"),
    openingHours: jsonb("opening_hours").notNull().default({}),
    themeId: uuid("theme_id").references(() => themes.id, { onDelete: "set null" }),
    primaryColor: varchar("primary_color", { length: 7 }).notNull().default("#FF6534"),
    backgroundColor: varchar("background_color", { length: 7 }).notNull().default("#F7F6F2"),
    plan: varchar("plan", { length: 16 }).notNull().default("free"),
    layoutType: varchar("layout_type", { length: 16 }).notNull().default("grid"),
    showPrice: boolean("show_price").notNull().default(true),
    showAddress: boolean("show_address").notNull().default(true),
    showOpeningHours: boolean("show_opening_hours").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [index("tenants_owner_id_idx").on(table.ownerId)],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
    description: varchar("description", { length: 200 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [
    unique("categories_tenant_slug_unique").on(table.tenantId, table.slug),
    index("categories_tenant_sort_idx").on(table.tenantId, table.sortOrder),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    discountPrice: integer("discount_price"),
    imageUrl: text("image_url"),
    imageThumbnailUrl: text("image_thumbnail_url"),
    imgbbImageId: varchar("imgbb_image_id", { length: 100 }),
    isFeatured: boolean("is_featured").notNull().default(false),
    isAvailable: boolean("is_available").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    unique("products_tenant_slug_unique").on(table.tenantId, table.slug),
    index("products_tenant_category_idx").on(table.tenantId, table.categoryId),
    index("products_tenant_active_idx").on(table.tenantId, table.isActive),
    index("products_tenant_featured_idx").on(table.tenantId, table.isFeatured),
    index("products_tenant_sort_idx").on(table.tenantId, table.sortOrder),
  ],
);

export const customLinks = pgTable(
  "custom_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    url: text("url").notNull(),
    icon: varchar("icon", { length: 40 }),
    linkType: varchar("link_type", { length: 30 }).notNull().default("custom"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [index("custom_links_tenant_sort_idx").on(table.tenantId, table.sortOrder)],
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    eventType: analyticsEventType("event_type").notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    linkId: uuid("link_id").references(() => customLinks.id, { onDelete: "set null" }),
    sessionId: varchar("session_id", { length: 80 }).notNull(),
    referrer: text("referrer"),
    deviceType: varchar("device_type", { length: 16 }),
    browser: varchar("browser", { length: 40 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("analytics_events_tenant_created_idx").on(table.tenantId, table.createdAt),
    index("analytics_events_tenant_event_created_idx").on(
      table.tenantId,
      table.eventType,
      table.createdAt,
    ),
    index("analytics_events_tenant_product_created_idx").on(
      table.tenantId,
      table.productId,
      table.createdAt,
    ),
  ],
);

export const analyticsDaily = pgTable(
  "analytics_daily",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    eventDate: date("event_date").notNull(),
    pageViews: integer("page_views").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    productViews: integer("product_views").notNull().default(0),
    categoryClicks: integer("category_clicks").notNull().default(0),
    linkClicks: integer("link_clicks").notNull().default(0),
    whatsappClicks: integer("whatsapp_clicks").notNull().default(0),
    mapsClicks: integer("maps_clicks").notNull().default(0),
    ...timestamps,
  },
  (table) => [unique("analytics_daily_tenant_date_unique").on(table.tenantId, table.eventDate)],
);
