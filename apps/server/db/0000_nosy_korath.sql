CREATE TABLE `device_saving` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` integer NOT NULL,
	`timestamp` text NOT NULL,
	`device_timestamp` text NOT NULL,
	`carbon_saved` real NOT NULL,
	`fuel_saved` real NOT NULL,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`timezone` text NOT NULL
);
