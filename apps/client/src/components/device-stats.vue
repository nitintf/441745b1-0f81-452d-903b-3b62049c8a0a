<script setup lang="ts">
import { subDays, subYears } from "date-fns";
import { ref } from "vue";

import DatePicker from "@/volt/DatePicker.vue";

import DateRangeSavings from "./date-range-savings.vue";
import SavingsSummary from "./savings-summary.vue";

const props = defineProps({
	selectedDevice: {
		type: Number,
		default: null,
	},
});

const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

const selectedPeriod = ref<string | null>(null);

const timePeriods = [
	{ label: "Last 30 days", value: "last-30-days" },
	{ label: "Last 60 days", value: "last-60-days" },
	{ label: "Last year", value: "last-year" },
];

const setTimePeriod = (period: string) => {
	selectedPeriod.value = period;
	const now = new Date();

	switch (period) {
		case "last-30-days":
			startDate.value = subDays(now, 30);
			endDate.value = now;
			break;
		case "last-60-days":
			startDate.value = subDays(now, 60);
			endDate.value = now;
			break;
		case "last-year":
			startDate.value = subYears(now, 1);
			endDate.value = now;
			break;
	}
};
</script>

<template>
  <SavingsSummary :selected-device="selectedDevice" />

  <hr class="mb-8 border-border" />

  <div class="mb-8">
    <div class="mb-6 flex gap-4 items-center">
      <DatePicker 
        v-model="startDate" 
        showIcon 
        fluid 
        iconDisplay="input" 
        inputId="startDate"
        placeholder="Select start date"
        :disabled="!selectedDevice"
      />
      <DatePicker 
        v-model="endDate" 
        showIcon 
        fluid 
        iconDisplay="input" 
        inputId="endDate"
        placeholder="Select end date"
        :disabled="!selectedDevice"
      />
    </div>

    <div class="mb-8 flex gap-2">
      <button
        v-for="period in timePeriods"
        :key="period.value"
        @click="setTimePeriod(period.value)"
        :disabled="!selectedDevice"
        :class="[
          'px-4 py-2 border rounded text-sm transition-colors',
          !selectedDevice 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : selectedPeriod === period.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:bg-muted',
        ]"
      >
        {{ period.label }}
      </button>
    </div>
  </div>

  <DateRangeSavings 
    :selected-device="selectedDevice" 
    :start-date="startDate" 
    :end-date="endDate" 
  />
</template>
