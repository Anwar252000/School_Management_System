"use client";

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import React, { Fragment, useEffect, useState } from "react";
import ViewClass from "./view-fee-category";
import { SectionData } from "@/services/apis/sectionService";
import { ClassroomData } from "@/services/apis/classroomService";
import { ClassData } from "@/services/apis/classService";
import { FeeCategoryData } from "@/services/apis/feeCategoryService";
import ViewFeeCategories from "./view-fee-category";

const ReportsCard = ({
  feeCategories,
}: {
  feeCategories: FeeCategoryData[];
}) => {

  const feeCategoriesCount = feeCategories?.length.toString();
 
  interface ReportItem {
    id: number;
    name: string;
    count: string;
    rate: string;
    icon: React.ReactNode;
    color?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "destructive"
      | "default"
      | "dark";
  }

  const reports: ReportItem[] = [
    {
      id: 2,
      name: "No. of Fee Categories",
      count: (feeCategoriesCount ? feeCategoriesCount : 0).toString(),
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
  ];
  return (
    <Fragment>
      {reports.map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center 2xl:min-w-[168px]"
        >
          <div>
            <span
              className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-medium text-default-600">
              {item.name}
            </div>
            <div className={"text-3xl font-semibold text-${item.color} mt-1"}>
              {item.count}
            </div>
            {item.id === 2 && <ViewFeeCategories selectedFeeCategory={feeCategories} />}
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
