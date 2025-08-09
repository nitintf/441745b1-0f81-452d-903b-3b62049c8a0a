import type { Device, DeviceSaving, DeviceSavingsResponse } from "./types";

import { queryOptions } from "@tanstack/vue-query";

import { apiClient } from "./api";
import {
	getCarbonSavingsByMonth,
	getDieselSavingsByMonth,
	getTotalCarbonSavings,
	getTotalDieselSavings,
} from "./savings.utils";

export const allDevicesQueryOptions = queryOptions({
	queryKey: ["devices"],
	queryFn: async (): Promise<Device[]> => {
		const response = await apiClient.get<Device[]>("/devices");
		return response.data;
	},
});

export const deviceSavingsQueryOptions = (
	deviceId: number | null,
	startDate?: Date | null,
	endDate?: Date | null,
) =>
	queryOptions({
		queryKey: [
			"devices",
			"savings",
			deviceId,
			startDate?.toISOString(),
			endDate?.toISOString(),
		],
		queryFn: async (): Promise<DeviceSavingsResponse> => {
			let url = `/devices/${String(deviceId)}/savings`;

			if (startDate && endDate) {
				const params = new URLSearchParams({
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				});
				url += `?${params.toString()}`;
			}

			const response = await apiClient.get<DeviceSaving[]>(url);
			const data = response.data;

			const totals = {
				totalCarbonSavings: getTotalCarbonSavings(data),
				totalDieselSavings: getTotalDieselSavings(data),
				carbonSavingsByMonth: getCarbonSavingsByMonth(data),
				dieselSavingsByMonth: getDieselSavingsByMonth(data),
			};

			return {
				data,
				totals,
			};
		},
		enabled: !!deviceId,
	});
