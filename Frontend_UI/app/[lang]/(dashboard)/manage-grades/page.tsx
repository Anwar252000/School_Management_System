"use client";

import React, { useState } from "react";
import StudentGrade from "./student-grade";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const page = () => {
  const [classId, setClassId] = useState<number | null>(null);

  const { data, refetch } = useFetchClassQuery();
  const classes = data?.data as ClassData[];
  const filteredClassName = classes?.find(
    (cd) => cd.classId === classId
  )?.className;
  const handleRefetch = () => {
    refetch();
  };
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Academic</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">
          Students Grade {filteredClassName}
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 mb-4 mt-4">
          <Label>Select Class</Label>
          <Select onValueChange={(value) => setClassId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cd) => (
                <SelectItem
                  key={cd.classId}
                  value={cd.classId?.toString() || ""}
                >
                  {cd.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <StudentGrade
        refetch={handleRefetch}
        classId={classId ?? 0}
        studentClassName={filteredClassName}
      />
    </div>
  );
};

export default page;
