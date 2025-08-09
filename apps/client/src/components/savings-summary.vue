<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

import { deviceSavingsQueryOptions } from "@/lib/queries";

interface Props {
	selectedDevice: number | null;
}

const props = defineProps<Props>();

const { data } = useQuery(deviceSavingsQueryOptions(props.selectedDevice));

const totalCarbonSavings = computed(
	() => data.value?.totals.totalCarbonSavings || 0,
);
const monthlyCarbonSavings = computed(
	() => data.value?.totals.carbonSavingsByMonth || 0,
);
const totalDieselSavings = computed(
	() => data.value?.totals.totalDieselSavings || 0,
);
const monthlyDieselSavings = computed(
	() => data.value?.totals.dieselSavingsByMonth || 0,
);
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="mb-6 flex flex-col">
        <h2 class="font-semibold text-foreground text-xl">
          Estimated carbon savings
        </h2>
        <span class="text-muted-foreground text-sm">1 Tonne = 1,000 kg</span>
      </div>

      <div class="mb-8 grid grid-cols-2 gap-8">
        <div class="text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <h3 class="text-muted-foreground">Total</h3>
          </div>
          <div class="mb-1 font-light text-4xl text-carbon-savings">
            {{ totalCarbonSavings.toFixed(1) }}
          </div>
          <div class="text-carbon-savings">Tonnes</div>
        </div>

        <div class="text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <h3 class="text-muted-foreground">Monthly</h3>
          </div>
          <div class="mb-1 font-light text-4xl text-carbon-savings">
            {{ monthlyCarbonSavings.toFixed(1) }}
          </div>
          <div class="text-carbon-savings">Tonnes</div>
        </div>
      </div>
    </div>

    <hr class="mb-8 border-border" />

    <div class="mb-8">
      <h2 class="mb-6 font-semibold text-foreground text-xl">
        Estimated diesel savings
      </h2>

      <div class="mb-8 grid grid-cols-2 gap-8">
        <div class="text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <h3 class="text-muted-foreground">Total</h3>
          </div>
          <div class="mb-1 font-light text-4xl text-diesel-savings">
            {{ totalDieselSavings.toLocaleString() }}
          </div>
          <div class="text-diesel-savings">Litres</div>
        </div>

        <div class="text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <h3 class="text-muted-foreground">Monthly</h3>
          </div>
          <div class="mb-1 font-light text-4xl text-diesel-savings">
            {{ monthlyDieselSavings.toLocaleString() }}
          </div>
          <div class="text-diesel-savings">Litres</div>
        </div>
      </div>
    </div>
  </div>
</template>
