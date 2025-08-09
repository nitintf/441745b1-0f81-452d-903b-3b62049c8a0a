<template>
  <div class="w-full overflow-hidden">
    <div ref="chartRef" :style="{ height: `${chartHeight}px`, width: '100%' }"></div>
    
    <!-- Chart Legend -->
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
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onMounted, ref, watch } from "vue";

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

const initChart = async () => {
	await nextTick();

	if (!chartRef.value) return;

	// Dispose existing chart instance
	if (chartInstance) {
		chartInstance.dispose();
	}

	chartInstance = echarts.init(chartRef.value);

	const carbonColor = "oklch(0.646 0.222 162.48)"; // Teal/turquoise color from image
	const dieselColor = "oklch(0.6 0.222 264.376)"; // Blue/purple color from image

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
				barWidth: "20%",
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
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
		animationEasing: "cubicOut",
	};

	chartInstance.setOption(option);

	// Handle window resize
	const handleResize = () => {
		chartInstance?.resize();
	};

	window.addEventListener("resize", handleResize);

	return () => {
		window.removeEventListener("resize", handleResize);
	};
};

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