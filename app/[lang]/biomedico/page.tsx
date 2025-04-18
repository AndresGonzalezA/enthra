"use client";

import { useEffect } from "react";
import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

const DevUploadBiomedico = () => {
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const credentials = session?.credentials;
    if (!credentials) return;

    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken,
      },
    });

    const solarSystemId = "solar001";
    const baseDate = new Date("2025-04-15T00:01:00Z");
    const items: {
      PutRequest: {
        Item: Record<string, any>;
      };
    }[] = [];

    for (let d = 0; d < 3; d++) {
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 5) {
          const timestamp = new Date(baseDate);
          timestamp.setUTCDate(baseDate.getUTCDate() + d);
          timestamp.setUTCHours(h);
          timestamp.setUTCMinutes(m);

          items.push({
            PutRequest: {
              Item: {
                solarSystemId: { S: solarSystemId },
                timestamp: { S: timestamp.toISOString() },
                dailyEnergy: { N: (Math.random() * 30).toFixed(2) },
                energyExportedToGrid: { N: (Math.random() * 5).toFixed(2) },
                gridEnergyConsumption: { N: (Math.random() * 5).toFixed(2) },
                instantPower: { N: (Math.random() * 6).toFixed(2) },
                lastUpdated: { S: timestamp.toISOString() },
                monthlyEnergy: { N: (Math.random() * 500).toFixed(2) },
                solarEnergyConsumption: { N: (Math.random() * 25).toFixed(2) },
                systemStatus: { BOOL: true },
                totalEnergy: { N: (11500 + Math.random() * 1000).toFixed(2) }
              },
            },
          });
        }
      }
    }

    const uploadChunks = async () => {
      for (let i = 0; i < items.length; i += 25) {
        const chunk = items.slice(i, i + 25);
        await client.send(
          new BatchWriteItemCommand({
            RequestItems: {
              SolarSystemData: chunk,
            }            
          })
        );
      }
      console.log("Carga completa desde biomedico");
    };

    uploadChunks();
  }, []);

  return <div className="p-10 text-xl font-semibold">Subiendo datos de prueba desde Biomedico...</div>;
};

export default DevUploadBiomedico;
