"use client";

import { useEffect, useState } from "react";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "./components/reports-snapshot";
import CountryMap from "./components/country-map";
import UserDeviceReport from "./components/user-device-report";
import UserStats from "./components/user-stats-chart";
import UsersStat from "./components/users-stat";
import ReportsArea from "./components/reports-area";
import DashboardSelect from "@/components/dasboard-select";
import TopTen from "./components/top-ten";
import TopPage from "./components/top-page";

interface DashboardPageViewProps {
  trans: {
    [key: string]: string;
  };
}

const DashboardPageView = ({ trans }: DashboardPageViewProps) => {
  const [greeting, setGreeting] = useState("Cargando...");
  const [solarSystemId, setSolarSystemId] = useState("");

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const credentials = session?.credentials;
    const email = session?.user?.email;

    if (!credentials || !email) return;

    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken,
      },
    });

    const fetchData = async () => {
      const userData = await client.send(
        new GetItemCommand({
          TableName: "Users",
          Key: {
            userId: { S: session?.user?.id },
          },
        })
      );

      const solarSystemId = userData?.Item?.solarSystemId?.S || "";
      setSolarSystemId(solarSystemId);

      const solarData = await client.send(
        new GetItemCommand({
          TableName: "SolarSystems",
          Key: {
            solarSystemId: { S: solarSystemId },
          },
        })
      );

      const userName = userData?.Item?.fullName?.S || "";
      const systemName = solarData?.Item?.name?.S || "";
      setGreeting(`Hola, ${userName} – ${systemName}`);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">
          {greeting}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <ReportsSnapshot solarSystemId={solarSystemId} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <UsersStat />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReportsArea />
        </div>
        <Card>
          <CardHeader className="border-none p-6 pt-5 mb-0">
            <CardTitle className="text-lg font-semibold text-default-900 p-0">
              New vs Returning Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserStats />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-none p-6 pt-5 mb-0">
            <CardTitle className="text-lg font-semibold text-default-900 p-0">
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashtail-legend">
              <UserDeviceReport />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card>
          <CardHeader className="border-none pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 text-xl font-semibold text-default-900 whitespace-nowrap">
                User By Country
              </div>
              <div className="flex-none">
                <DashboardSelect />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-0">
            <CountryMap />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <TopTen />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="border-none pb-0">
              <CardTitle className="pt-2.5">Top Page/Post</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <TopPage />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageView;
