"use client";

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import React, { Fragment, useEffect, useState } from "react";
import ViewClass from "./view-class";
import ViewSection from "./view-section";
import ViewClassroom from "./view-classroom";
import { SectionData } from "@/services/apis/sectionService";
import { ClassroomData } from "@/services/apis/classroomService";
import { ClassData } from "@/services/apis/classService";

const ReportsCard = ({
  sections,
  classrooms,
  classes,
}: {
  sections: SectionData[];
  classrooms: ClassroomData[];
  classes: ClassData[];
}) => {

  const classesCount = classes?.length.toString();
  const sectionsCount = sections?.length.toString();
  const classroomCount = classrooms?.length.toString();
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
      id: 1,
      name: "No. of Classrooms",
      // count:"10",
      count: (classroomCount ? classroomCount : 0).toString(),
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    {
      id: 2,
      name: "No. of Classes",
      count: (classesCount ? classesCount : 0).toString(),
      rate: "8.2",
      icon: <Docs className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    {
      id: 3,
      name: "No. of Sections",
      count: (sectionsCount ? sectionsCount : 0).toString(),
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
            {item.id === 1 && <ViewClassroom selectedClassroom={classrooms} />}
            {item.id === 2 && <ViewClass selectedClass={classes} />}
            {item.id === 3 && (
              <ViewSection selectedSection={sections} selectedClass={classes} />
            )}
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
