"use client"

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import React, { Fragment } from "react";
import ViewPeriod from "./view-period";
import { PeriodData } from "@/services/apis/periodService";

interface PeriodsProps {
  Periods: PeriodData[];
  refetch: () => void
}

export default function PeriodsReports({ Periods, refetch }: PeriodsProps) {
  
  const periodCount = Periods?.length.toString();

  interface ReportItem {
    id: number;
    name: string;
    count: string;
    rate: string;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive' | 'default' | 'dark'
  }

  const reports: ReportItem[] = [
    {
      id: 1,
      name: "No. of Periods`",
      count: (periodCount ? periodCount : 0).toString(),
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive"
    },


  ]
  return (
    <Fragment>
      {
        reports.map(item => (
          <Card key={item.id} className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center 2xl:min-w-[168px]">
            <div>
              <span className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}>
                {item.icon}
              </span>
            </div>
            <div className="mt-4 text-center">
              <div className="text-base font-medium text-default-600">{item.name}</div>
               <div className={"text-3xl font-semibold text-${item.color} mt-1"}>
              {item.count}
            </div>
            {item.id === 1 && <ViewPeriod periods={Periods} refetch={refetch} />}
            </div>
          </Card>
        ))
      }
    </Fragment>
  );
};

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
