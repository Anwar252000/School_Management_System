"use client";
import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import React, { Fragment, useState } from "react";
import ViewDepartment from "./view-department";
import { CampusData } from "@/services/apis/campusService";

interface ReportsCardProps {
  //campusId: number | undefined;
  campus: CampusData;
  refetch: () => void;
}

interface ReportItem {
  id: number;
  name: string;
  count: string;
  rate: string;
  icon: React.ReactNode;
  color: string;
}

//const ReportsCard = ({ campusId }: ReportsCardProps) => {
const ReportsCard = ({ campus, refetch }: ReportsCardProps) => {
  // const [department, setDepartments] = useState(
  //   departments as DepartmentData[]
  // );
  const reports: ReportItem[] = [
    {
      id: 1,
      name: "No. of Departments",
      count: (campus.departments ? campus.departments.length : 0).toString(),
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      id: 2,
      name: "No. of Classrooms",
      count: "240",
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-success" />,
      color: "success",
    },
    {
      id: 3,
      name: "No. of Students",
      count: "96",
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    {
      id: 4,
      name: "No. of Employees",
      count: "18",
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-info" />,
      color: "info",
    },
  ];

  return (
    <Fragment>
      {reports.map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6 flex flex-col items-center 2xl:min-w-[168px]"
        >
          <div>
            <span
              className={
                "h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10"
              }
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center justify-center">
            <div className="text-base font-medium text-default-600">
              {item.name}
            </div>
            <div className={"text-3xl font-semibold text-${item.color} mt-1"}>
              {item.count}
            </div>
            {item.id === 1 && <ViewDepartment campus={campus} refetch={refetch} />}
            {/* {item.id === 2 && <ViewDepartment campusId={campusId} />} */}
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;
