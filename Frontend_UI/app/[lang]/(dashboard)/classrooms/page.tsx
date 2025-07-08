"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import ReportsCard from "./reports";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddSection from "./add-section";
import AddClass from "./add-class";
import { useState } from "react";
import AddClassroom from "./add-classroom";
import AssignClasses from "./add-assignclasses";
import ClassAssignTable from "./classassign-table";
import {
  SectionData,
  useFetchSectionQuery,
} from "@/services/apis/sectionService";
import {
  ClassroomData,
  useFetchClassroomsQuery,
} from "@/services/apis/classroomService";
import { ClassData, useDeleteClassMutation, useFetchClassQuery } from "@/services/apis/classService";
import { CampusData, useFetchCampusesQuery } from "@/services/apis/campusService";
import { ClassAssignData, useFetchClassAssignmentsQuery } from "@/services/apis/assignClassService";

const Classroom = () => {
  const { data, isLoading, refetch } = useFetchSectionQuery();
  const sectionsData = data?.data as SectionData[];

  const { data: classrooms,isLoading: classroomLoading, refetch: classroomsRefetch,} = useFetchClassroomsQuery();
  const classroomsData = classrooms?.data as ClassroomData[];

  const {data: classes, isLoading: classLoading, refetch: classRefetch} = useFetchClassQuery();
  const [deleteClass] = useDeleteClassMutation();
  const classData = classes?.data as ClassData[];

  const {data: campus, isLoading: campusLoading, isError: campusError, refetch: campusRefetch} = useFetchCampusesQuery();
  const campusData = campus?.data as CampusData[];

  const {data: assignClass, isLoading: assignClassLoading, refetch: assignClassRefetch} = useFetchClassAssignmentsQuery();
  const assignClassData = assignClass?.data as ClassAssignData[];

  const handleRefetch = () => {
    refetch();
    classRefetch();
    classroomsRefetch();
    campusRefetch();
    assignClassRefetch();
  };

  return (
    <div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Classroom</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddClassroom campuses={campusData} refetch={handleRefetch} />
          <AddClass refetch={handleRefetch} />
          <AddSection refetch={handleRefetch} />
          <AssignClasses
            classes={classData}
            section={sectionsData}
            classroom={classroomsData}
            campus={campusData}
            assignClassData={assignClassData}
            refetch={handleRefetch}
          />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        defaultValue={`item-1`}
      >
        <AccordionItem
          value="item-1"
          className=" shadow-none rounded-none open"
        >
          <AccordionTrigger>Classroom Details</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                <ReportsCard
                  sections={sectionsData}
                  classrooms={classroomsData}
                  classes = {classData} 
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        // defaultValue={`item-1`}
      >
        <AccordionItem
          value="item-1"
          className=" shadow-none rounded-none open"
        >
          <AccordionTrigger>Classroom Assignment</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              {/* <ReportsCard/>x */}
              <ClassAssignTable
                classes={classData}
                section={sectionsData}
                classroom={classroomsData}
                campus={campusData}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Classroom;
