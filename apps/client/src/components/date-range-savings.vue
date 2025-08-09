<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { format, parseISO } from "date-fns";
import { computed } from "vue";

import { deviceSavingsQueryOptions } from "@/lib/queries";

import SavingsChart from "./chart.vue";

interface Props {
	selectedDevice: number | null;
	startDate: Date | null;
	endDate: Date | null;
}

const props = defineProps<Props>();

const queryOptions = computed(() => 
	deviceSavingsQueryOptions(
		props.selectedDevice,
		props.startDate,
		props.endDate,
	)
);

const { data } = useQuery(queryOptions);

const totalCarbonSavings = computed(
	() => data.value?.totals.totalCarbonSavings || 0,
);
const totalDieselSavings = computed(
	() => data.value?.totals.totalDieselSavings || 0,
);

const savingsDataList = computed(() => data.value?.data ?? []);

const formatDieselValue = (value: number): string => {
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)} k`;
	}
	return value.toLocaleString();
};

const chartData = computed(() => {
	if (!savingsDataList.value) return { carbonData: [], dieselData: [] };

	const monthlyData: { [key: string]: { carbon: number; diesel: number } } = {};

	savingsDataList.value.forEach((saving) => {
		const date = parseISO(saving.timestamp);
		const monthKey = format(date, "MMM yyyy");

		if (!monthlyData[monthKey]) {
			monthlyData[monthKey] = { carbon: 0, diesel: 0 };
		}

		monthlyData[monthKey].carbon += saving.carbonSaved;
		monthlyData[monthKey].diesel += saving.fuelSaved;
	});

	const months = Object.keys(monthlyData).sort((a, b) => {
		const dateA = new Date(a);
		const dateB = new Date(b);
		return dateA.getTime() - dateB.getTime();
	});

	const carbonData = months.map((month) => ({
		month,
		value: monthlyData[month].carbon,
	}));

	const dieselData = months.map((month) => ({
		month,
		value: monthlyData[month].diesel,
	}));

	return { carbonData, dieselData };
});
</script>

<template>
  <div class="mb-8">
    <div class="mb-8 grid grid-cols-2 gap-8">
      <div class="text-center">
        <div class="mb-2 flex items-center justify-center gap-2">
          <h3 class="text-muted-foreground">Estimated carbon savings</h3>
        </div>
        <div class="mb-1 font-light text-4xl text-carbon-savings">
          {{ totalCarbonSavings.toFixed(1) }}
        </div>
        <div class="text-carbon-savings">Tonnes</div>
      </div>

      <div class="text-center">
        <div class="mb-2 flex items-center justify-center gap-2">
          <h3 class="text-muted-foreground">Estimated diesel savings</h3>
        </div>
        <div class="mb-1 font-light text-4xl text-diesel-savings">
          {{ formatDieselValue(totalDieselSavings) }}
        </div>
        <div class="text-diesel-savings">Litres</div>
      </div>
    </div>
  </div>

  <div class="w-full">
    <SavingsChart
      :carbon-data="chartData.carbonData"
      :diesel-data="chartData.dieselData"
      :chart-height="400"
    />
  </div>
</template>
