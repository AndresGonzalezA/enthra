"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsChart from "./reports-chart";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const ReportsSnapshot = ({ solarSystemId }: { solarSystemId: string }) => {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [seriesData, setSeriesData] = useState({
    instantPower: [] as number[],
    dailyEnergy: [] as number[],
    solarEnergyConsumption: [] as number[],
    energyExportedToGrid: [] as number[],
    categories: [] as string[],
  });

  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const primary = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`;
  const warning = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`;
  const success = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`;
  const info = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`;

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const credentials = session?.credentials;
    if (!credentials || !solarSystemId) return;

    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken,
      },
    });

    const fetchData = async () => {
      const res = await client.send(
        new ScanCommand({
          TableName: "SolarSystemData",
          FilterExpression: "solarSystemId = :id",
          ExpressionAttributeValues: {
            ":id": { S: solarSystemId },
          },
        })
      );

      const filteredItems = (res.Items || [])
        .filter((item: any) => item.timestamp.S.startsWith(selectedDate))
        .map((item: any) => ({
          instantPower: parseFloat(item.instantPower.N),
          dailyEnergy: parseFloat(item.dailyEnergy.N),
          solarEnergyConsumption: parseFloat(item.solarEnergyConsumption.N),
          energyExportedToGrid: parseFloat(item.energyExportedToGrid.N),
          timestamp: item.timestamp.S,
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setSeriesData({
        instantPower: filteredItems.map((d) => d.instantPower),
        dailyEnergy: filteredItems.map((d) => d.dailyEnergy),
        solarEnergyConsumption: filteredItems.map((d) => d.solarEnergyConsumption),
        energyExportedToGrid: filteredItems.map((d) => d.energyExportedToGrid),
        categories: filteredItems.map((d) => new Date(d.timestamp).toLocaleTimeString()),
      });
    };

    fetchData();
  }, [solarSystemId, selectedDate]);

  const tabsTrigger = [
    {
      value: "power",
      text: "Potencia Instantánea",
      total: `${seriesData.instantPower.at(-1) ?? 0} W`,
      color: "primary",
    },
    {
      value: "daily",
      text: "Energía Diaria",
      total: `${seriesData.dailyEnergy.at(-1) ?? 0} kWh`,
      color: "warning",
    },
    {
      value: "consumption",
      text: "Consumo Solar",
      total: `${seriesData.solarEnergyConsumption.at(-1) ?? 0} kWh`,
      color: "success",
    },
    {
      value: "exported",
      text: "Exportada A Red",
      total: `${seriesData.energyExportedToGrid.at(-1) ?? 0} kWh`,
      color: "info",
    },
  ];

  const tabsContentData = [
    {
      value: "power",
      series: [{ data: seriesData.instantPower }],
      color: primary,
    },
    {
      value: "daily",
      series: [{ data: seriesData.dailyEnergy }],
      color: warning,
    },
    {
      value: "consumption",
      series: [{ data: seriesData.solarEnergyConsumption }],
      color: success,
    },
    {
      value: "exported",
      series: [{ data: seriesData.energyExportedToGrid }],
      color: info,
    },
  ];

  return (
    <Card>
      <CardHeader className="border-none pb-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">
              Monitoreo Solar
            </div>
            <span className="text-xs text-default-600">
              Datos generados por el sistema en tiempo real
            </span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-background text-foreground"
          />
        </div>
      </CardHeader>
      <CardContent className="p-1 md:p-5">
        <Tabs defaultValue="power">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 justify-start w-full bg-transparent h-full">
            {tabsTrigger.map((item, index) => (
              <TabsTrigger
                key={`report-trigger-${index}`}
                value={item.value}
                className={cn(
                  "flex flex-col gap-1.5 p-4 overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden data-[state=active]:shadow-none data-[state=active]:before:block",
                  {
                    "bg-primary/30 data-[state=active]:bg-primary/30 dark:bg-primary/70": item.color === "primary",
                    "bg-orange-50 data-[state=active]:bg-orange-50 dark:bg-orange-500": item.color === "warning",
                    "bg-green-50 data-[state=active]:bg-green-50 dark:bg-green-500": item.color === "success",
                    "bg-cyan-50 data-[state=active]:bg-cyan-50 dark:bg-cyan-500": item.color === "info",
                  }
                )}
              >
                <span className={cn(
                  "h-10 w-10 rounded-full absolute -top-3 -right-3 ring-8",
                  {
                    "bg-primary/50 ring-primary/30 dark:bg-primary dark:ring-primary/40": item.color === "primary",
                    "bg-orange-200 ring-orange-100 dark:bg-orange-300 dark:ring-orange-400": item.color === "warning",
                    "bg-green-200 ring-green-100 dark:bg-green-300 dark:ring-green-400": item.color === "success",
                    "bg-cyan-200 ring-cyan-100 dark:bg-cyan-300 dark:ring-cyan-400": item.color === "info",
                  }
                )}></span>
                <span className="text-sm text-default-800 dark:text-primary-foreground font-semibold capitalize relative z-10">
                  {item.text}
                </span>
                <span className={`text-lg font-semibold text-${item.color}/80 dark:text-primary-foreground`}>
                  {item.total}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabsContentData.map((item, index) => (
            <TabsContent key={`report-tab-${index}`} value={item.value}>
              <ReportsChart
                series={item.series}
                chartColor={item.color}
                categories={seriesData.categories}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsSnapshot;
