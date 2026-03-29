import { pgTable, text, timestamp, uuid, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), //clerk id
  email: text("email").notNull().unique(),
  name: text("name"),
  imageURL: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text().notNull(),
  imageURL: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id,{ onDelete: "cascade" })
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // one user, many products
  comments: many(comments), // one user, many comments
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, {
    fields:[products.userId],
    references: [users.id]
  })
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  // comments.userId is the foreign key, users.id is the primary key
  user: one(users, {
    fields: [comments.productId],
    references: [users.id],
  }),

  product: one(products, {
    fields: [comments.userId],
    references: [products.id],
  }),
}))

// type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Products = typeof products.$inferSelect;
export type NewProducts = typeof products.$inferInsert;

export type Comments = typeof comments.$inferSelect;
export type NewComments = typeof comments.$inferInsert;