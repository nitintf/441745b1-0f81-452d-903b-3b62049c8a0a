<template>
  <div class="w-full overflow-hidden">
    <div ref="chartRef" :style="{ height: `${chartHeight}px`, width: '100%' }" :class="{ 'opacity-50': loading }"></div>
    
    <div class="flex items-center justify-center gap-6 mt-4">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-carbon-savings rounded"></div>
        <span class="text-sm text-muted-foreground">Carbon savings</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-diesel-savings rounded"></div>
        <span class="text-sm text-muted-foreground">Diesel savings</span>
      </div>
    </div>
    
    <div class="flex items-center justify-center mt-4 gap-4">
      <p v-if="seconds <= 0" class="text-sm text-muted-foreground">
        <small>Loaded.</small>
      </p>
      <p v-else class="text-sm text-muted-foreground">
        <small>
          Data coming in
          <b>{{ seconds }}</b>
          second{{ seconds > 1 ? "s" : "" }}...
        </small>
      </p>
      <div class="actions">
        <button 
          @click="refresh" 
          :disabled="seconds > 0"
          class="px-4 py-2 border rounded text-sm transition-colors bg-background text-foreground border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { BarChart } from "echarts/charts";
import {
	GridComponent,
	LegendComponent,
	TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	watch,
} from "vue";

use([
	BarChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	CanvasRenderer,
]);

interface ChartDataPoint {
	month: string;
	value: number;
}

interface Props {
	carbonData: ChartDataPoint[];
	dieselData: ChartDataPoint[];
	chartHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
	chartHeight: 400,
});

const chartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

const loading = shallowRef(false);

const seconds = shallowRef(0);
let timer: ReturnType<typeof setInterval> | undefined;

onBeforeUnmount(() => {
	if (timer !== undefined) {
		clearInterval(timer);
	}
});

const initChart = async () => {
	await nextTick();

	if (!chartRef.value) return;

	if (chartInstance) {
		chartInstance.dispose();
	}

	chartInstance = echarts.init(chartRef.value);

	const carbonColor = "oklch(0.65 0.19 180)";
	const dieselColor = "oklch(0.6 0.25 260)";

	const option = {
		grid: {
			top: 40,
			left: 80,
			right: 80,
			bottom: 80,
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: props.carbonData.map((item) => item.month),
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: "#888",
				fontSize: 12,
				fontFamily: "inherit",
			},
		},
		yAxis: [
			{
				type: "value",
				name: "",
				position: "left",
				min: 0,
				max: 15,
				interval: 3,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: "#888",
					fontSize: 12,
					fontFamily: "inherit",
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#f0f0f0",
						width: 1,
					},
				},
			},
			{
				type: "value",
				name: "",
				position: "right",
				min: 0,
				max: 10000,
				interval: 2000,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: "#888",
					fontSize: 12,
					fontFamily: "inherit",
					formatter: (value: number) => {
						if (value >= 1000) {
							return `${value / 1000}k`;
						}
						return value.toString();
					},
				},
				splitLine: {
					show: false,
				},
			},
		],
		series: [
			{
				name: "Carbon savings",
				type: "bar",
				yAxisIndex: 0,
				data: props.carbonData.map((item) => item.value),
				itemStyle: {
					color: carbonColor,
					borderRadius: [4, 4, 0, 0],
				},
				emphasis: {
					itemStyle: {
						color: carbonColor,
					},
				},
				barWidth: "20%",
				barGap: "5%",
			},
			{
				name: "Diesel savings",
				type: "bar",
				yAxisIndex: 1,
				data: props.dieselData.map((item) => item.value),
				itemStyle: {
					color: dieselColor,
					borderRadius: [4, 4, 0, 0],
				},
				emphasis: {
					itemStyle: {
						color: dieselColor,
					},
				},
				barWidth: "20%",
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "line",
			},
			backgroundColor: "rgba(255, 255, 255, 0.95)",
			borderColor: "#e0e0e0",
			borderWidth: 1,
			textStyle: {
				color: "#333",
				fontSize: 12,
				fontFamily: "inherit",
			},
			formatter: (params: any[]) => {
				let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;

				params.forEach((param, index) => {
					const unit = index === 0 ? "Tonnes" : "Litres";
					const value =
						index === 1 && param.value >= 1000
							? `${(param.value / 1000).toFixed(1)}k`
							: param.value.toFixed(1);

					result += `
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 12px; height: 12px; background-color: ${param.color}; margin-right: 8px; border-radius: 2px;"></div>
              <span style="margin-right: 8px;">${param.seriesName}:</span>
              <span style="font-weight: 600;">${value} ${unit}</span>
            </div>
          `;
				});

				return result;
			},
		},
		animation: true,
		animationDuration: 800,
		animationEasing: "cubicOut" as const,
	};

	chartInstance.setOption(option);

	const handleResize = () => {
		chartInstance?.resize();
	};

	window.addEventListener("resize", handleResize);

	return () => {
		window.removeEventListener("resize", handleResize);
	};
};

function tick() {
	seconds.value--;

	if (seconds.value === 0) {
		clearInterval(timer);
		loading.value = false;
		initChart();
	}
}

function refresh() {
	seconds.value = 3;
	loading.value = true;

	if (timer !== undefined) {
		clearInterval(timer);
	}
	timer = window.setInterval(tick, 1000);
}

onMounted(() => {
	initChart();
});

watch(
	() => [props.carbonData, props.dieselData],
	() => {
		initChart();
	},
	{ deep: true },
);
</script>