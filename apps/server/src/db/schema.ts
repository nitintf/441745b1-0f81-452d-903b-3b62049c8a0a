import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const devices = sqliteTable("devices", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	timezone: text("timezone").notNull(),
});

export const deviceSaving = sqliteTable("device_saving", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	deviceId: integer("device_id")
		.notNull()
		.references(() => devices.id),
	timestamp: text("timestamp").notNull(),
	deviceTimestamp: text("device_timestamp").notNull(),
	carbonSaved: real("carbon_saved").notNull(),
	fuelSaved: real("fuel_saved").notNull(),
});

export const devicesRelations = relations(devices, ({ many }) => ({
	savings: many(deviceSaving),
}));

export const deviceSavingRelations = relations(deviceSaving, ({ one }) => ({
	device: one(devices, {
		fields: [deviceSaving.deviceId],
		references: [devices.id],
	}),
}));
