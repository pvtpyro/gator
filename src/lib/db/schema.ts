import { pgTable, timestamp, uuid, text, foreignKey, uniqueIndex } from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	name: text("name").notNull().unique(),
});
export type User = typeof users.$inferSelect;

// Feeds
export const feeds = pgTable("feeds", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	name: text("name").notNull(),
	url: text("url").notNull().unique(),
	user_id: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
		name: "userid_fk",
		columns: [table.user_id],
		foreignColumns: [users.id],
	})
	.onDelete('cascade')
]);
export type Feed = typeof feeds.$inferSelect;

// Feed Follows
export const feed_follows = pgTable("feed_follows", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	user_id: uuid("user_id").notNull(),
	feed_id: uuid("feed_id").notNull(),
}, (table) => [
	foreignKey({
		name: "userid_fk",
		columns: [table.user_id],
		foreignColumns: [users.id],
	})
	.onDelete('cascade'),
	foreignKey({
		name: "feedid_fk",
		columns: [table.feed_id],
		foreignColumns: [feeds.id],
	})
	.onDelete('cascade'),
	uniqueIndex('unique_user_feed').on(table.user_id, table.feed_id)
])
export type FeedFollows = typeof feed_follows.$inferSelect;