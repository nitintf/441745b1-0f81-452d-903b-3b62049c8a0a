<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

import { allDevicesQueryOptions } from "../lib/queries";
import { capitalize } from "../lib/utils";
import DeviceStats from "./device-stats.vue";

const { data: devices, isPending: loadingDevices } = useQuery(
	allDevicesQueryOptions,
);

const selectedDataSource = ref<number | undefined>(undefined);
</script>

<template>
  <div
    v-if="loadingDevices"
    class="flex items-center justify-center min-h-screen bg-background"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="text-center">
        <h2 class="text-lg font-medium text-foreground mb-1">
          Loading Dashboard
        </h2>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background p-6 py-16">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-foreground mb-4">
          Estimated carbon savings and diesel savings
        </h1>

        <div class="flex items-center gap-3">
          <label
            for="data-source"
            class="text-sm font-medium text-muted-foreground"
            >Data Source:</label
          >
          <select
            id="data-source"
            v-model="selectedDataSource"
            class="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-[200px]"
          >
            <option :value="null">Select device</option>
            <option
              v-for="option in devices"
              :key="option.id"
              :value="option.id"
            >
              {{ capitalize(option.name) }}
            </option>
          </select>
        </div>

        <!-- Warning message when no device selected -->
        <div
          v-if="!selectedDataSource"
          class="mt-3 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
        >
          <svg
            class="w-5 h-5 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-yellow-800 text-sm"
            >Please select a device to view savings data and access date
            filtering options.</span
          >
        </div>
      </div>
      <DeviceStats
        :selected-device="selectedDataSource"
        :key="selectedDataSource"
      />
    </div>
  </div>
</template>
