"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useEffect, useState } from "react";
import AddTimeTable from "./add-timetable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ViewTimeTable from "./view-timetable";
import PeriodsReports from "./periods-reports";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import { AssignClassSubjectData, useFetchClassSubjectQuery } from "@/services/apis/assignClassSubjectService";
import { CampusData, useFetchCampusesQuery } from "@/services/apis/campusService";
import { PeriodData, useFetchPeriodsQuery } from "@/services/apis/periodService";
import { TimeTableData, useFetchTimeTableQuery } from "@/services/apis/timetableService";

const TimeTables = () => {
  const {data: classData, isLoading: classLoading, refetch: classRefetch} = useFetchClassQuery();
  const classes = classData?.data as ClassData[];
  const {data: assignSubjectData, isLoading: assignSubjectLoading, refetch: assignSubjectRefetch} = useFetchClassSubjectQuery();
  const assignSubject = assignSubjectData?.data as AssignClassSubjectData[];
  const {data: campusData, isLoading: campusLoading, isError: campusError, refetch: campusesRefetch} = useFetchCampusesQuery();
  const campuses = campusData?.data as CampusData[];
  const {data:periodData, isLoading: periodLoading, refetch: periodRefetch} = useFetchPeriodsQuery();
  const periods = periodData?.data as PeriodData[];
  const {data: timeTable, refetch: refetchTimeTable} = useFetchTimeTableQuery();
  const timeTableData = timeTable?.data as TimeTableData[];
 
  const handleRefetch = () => {
    classRefetch();
    assignSubjectRefetch();
    campusesRefetch();
    periodRefetch();
    refetchTimeTable();
  }

  return (
    <div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Academic</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Time Tables</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddTimeTable
            classes={classes}
            subject={assignSubject}
            campus={campuses}
            periods={periods}
            refetch={handleRefetch}
          />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="shadow-none rounded-none open">
          <AccordionTrigger>View Class Periods</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                <PeriodsReports Periods={periods} refetch={handleRefetch}/>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {classes?.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="w-full border rounded-md divide-y mt-5"
          defaultValue={`item-${classes[0].classId}`}
        >
          {classes?.map((classItem) => (
            <AccordionItem
              key={classItem.classId}
              value={`item-${classItem.classId}`}
              className="shadow-none rounded-none open"
            >
              <AccordionTrigger>
                {classItem.className} TimeTable
              </AccordionTrigger>
              <AccordionContent>
                <ViewTimeTable
                  className={classItem.className as string}
                  subjectData={assignSubject}
                  periodsData={periods}
                  timeTable={timeTableData}
                  refetch={handleRefetch}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default TimeTables;
