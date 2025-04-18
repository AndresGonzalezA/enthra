"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import {
  getGridConfig,
  getYAxisConfig,
} from "@/lib/appex-chart-options";

interface ReportsChartProps {
  series: ApexAxisChartSeries;
  chartColor: string;
  height?: number;
  categories?: string[];
}

const ReportsChart = ({ series, chartColor, height = 300, categories = [] }: ReportsChartProps) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();

  const theme = themes.find((theme) => theme.name === config);

  const options: any = {
    chart: {
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 4 },
    colors: [chartColor],
    tooltip: { theme: mode === "dark" ? "dark" : "light" },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
    ),
    fill: {
      type: "gradient",
      colors: chartColor,
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [50, 100, 0],
      },
    },
    yaxis: getYAxisConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`
    ),
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        rotateAlways: true,
        showDuplicates: false,
        formatter: (value: unknown) => {
          if (typeof value === "string" && value.includes(":")) {
            const parts = value.split(":");
            return `${parts[0]}:${parts[1]}`;
          }
          return String(value);
        },
            
        style: {
          colors: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`,
        },
      },
      tickAmount: 10,
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={height}
      width="100%"
    />
  );
};

export default ReportsChart;
