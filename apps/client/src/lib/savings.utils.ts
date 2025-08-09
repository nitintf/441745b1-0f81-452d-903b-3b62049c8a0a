import type { DeviceSaving } from "./types";

import { isSameMonth, isSameYear } from "date-fns";
import { filter, sumBy } from "lodash";

const filterBySameMonth = (deviceSavings: DeviceSaving[]) => {
	const now = new Date();

	return filter(deviceSavings, (saving) => {
		const savingDate = new Date(saving.timestamp);
		return isSameMonth(savingDate, now) && isSameYear(savingDate, now);
	});
};

export const getTotalCarbonSavings = (
	deviceSavings: DeviceSaving[],
): number => {
	return Number.parseFloat(sumBy(deviceSavings, "carbonSaved").toFixed(1));
};

export const getCarbonSavingsByMonth = (
	deviceSavings: DeviceSaving[],
): number => {
	const currentMonthSavings = filterBySameMonth(deviceSavings);

	return Number.parseFloat(sumBy(currentMonthSavings, "carbonSaved").toFixed(1));
};

export const getTotalDieselSavings = (
	deviceSavings: DeviceSaving[],
): number => {
	return Number.parseFloat(sumBy(deviceSavings, "fuelSaved").toFixed(1));
};

export const getDieselSavingsByMonth = (
	deviceSavings: DeviceSaving[],
): number => {
	const currentMonthSavings = filterBySameMonth(deviceSavings);

	return Number.parseFloat(sumBy(currentMonthSavings, "fuelSaved").toFixed(1));
};
