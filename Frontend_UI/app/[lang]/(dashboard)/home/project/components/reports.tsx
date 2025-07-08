"use client";

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import { DashboardData, useFetchDashboardCountQuery } from "@/services/apis/dashboardService";
import { TrendingUp } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";

const ReportsCard = () => {

  const { data, isLoading, error, refetch } = useFetchDashboardCountQuery();
  const dashboardCount = data?.data as DashboardData;


  
  interface ReportItem {
    id: number;
    name: string;
    count: number;
    rate: number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive' | 'default' | 'dark';
  }

  const reports: ReportItem[] = [
    {
      id: 1,
      name: "Total Sponsors",
      count: dashboardCount?.newSponsorsThisMonth || 0,
      rate: dashboardCount?.newSponsorsThisMonth || 0,
      icon: <Docs className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      id: 2,
      name: "Total Students",
      count: dashboardCount?.totalStudents || 0,
      rate: dashboardCount?.newStudentsThisMonth || 0,
      icon: <Docs className="w-6 h-6 text-success" />,
      color: "success",
    },
    {
      id: 3,
      name: "Total Staff",
      count: dashboardCount?.totalEmployees || 0,
      rate: dashboardCount?.newEmployeesThisMonth || 0,
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    { 
      id: 4,
      name: "Sponsored Students",
      count: dashboardCount?.sponsorStudent || 0,
      rate: dashboardCount?.newSponsorsThisMonth || 0,
      icon: <Docs className="w-6 h-6 text-info" />,
      color: "info",
    },
  ];

  return (
    <Fragment>
      {reports.map(item => (
        <Card key={item.id} className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6 flex flex-col items-center 2xl:min-w-[168px]">
          <div>
            <span className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}>
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-medium text-default-600">{item.name}</div>
            <div className={`text-3xl font-semibold text-${item.color} mt-1`}>{item.count}</div>
            <div className="flex items-center gap-1 mt-2.5">
              <span className="text-xs xl:text-sm font-medium text-default-600 whitespace-nowrap"> Progress</span>
              <span className="text-xs xl:text-sm font-medium text-success">+{item.rate}</span>

              <TrendingUp className="h-[14px] w-[14px] text-success/90" />
            </div>
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;
