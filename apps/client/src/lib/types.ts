export interface Device {
	id: number;
	name: string;
	timezone: string;
}

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
	details?: any;
}

export interface DateRange {
	start: string;
	end: string;
}

export interface DeviceSaving {
	id: number;
	deviceId: number;
	timestamp: string;
	deviceTimestamp: string;
	carbonSaved: number;
	fuelSaved: number;
}

export interface DeviceSavingsResponse {
	data: DeviceSaving[];
	totals: {
		totalCarbonSavings: number;
		totalDieselSavings: number;
		carbonSavingsByMonth: number;
		dieselSavingsByMonth: number;
	};
}

export type TimePeriod = "last-30-days" | "last-60-days" | "last-year";
