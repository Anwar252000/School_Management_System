"use client";

import React, { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentData, useFetchStudentByClassWiseQuery } from "@/services/apis/studentService";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import AddResults from "./add-results";
import { ExamPaperData, useFetchExamPapersQuery } from "@/services/apis/examPaperService";

const Page = () => {
  const [classId, setClassId] = useState<number | null>(null);
  const [examPaperId, setExamPaperId] = useState<number | null>(null);
  const { data: students, refetch } = useFetchStudentByClassWiseQuery(classId ?? 0);
  const studentData = Array.isArray(students?.data) ? (students?.data as StudentData[]) : [];

  const { data: classData, isLoading: classLoading, refetch: classRefetch, } = useFetchClassQuery();
  const classes = classData?.data as ClassData[];

  const { data: examPaper, error: examPaperError, isLoading: examPaperLoading, refetch: examPaperRefetch, } = useFetchExamPapersQuery();
  const examPapers = examPaper?.data as ExamPaperData[];

  const examPaperData = (() => {
    const filteredData = examPapers?.filter((item) => item.classId === classId) && examPapers|| [];

    const uniqueSubjects = new Map<number, ExamPaperData>();

    filteredData.forEach((item) => {
      if (!uniqueSubjects.has(item.subjectId)) {
        uniqueSubjects.set(item.subjectId, item);
      }
    });

    return Array.from(uniqueSubjects.values());
  })();


  const handleRefetch = () => {
    refetch();
    classRefetch();
    examPaperRefetch();
  };

  const handleSubjectSelection = (subjectId: string) => {
    const selectedPaper = examPaperData.find((paper) => paper.subjectId?.toString() === subjectId);
    if (selectedPaper && selectedPaper.examPaperId !== undefined) {
      setExamPaperId(selectedPaper.examPaperId); // Set the relevant examPaperId
    }
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Academic</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Students Results</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 mb-4 mt-4">
          <Label>Select Class</Label>
          <Select onValueChange={(value) => setClassId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cd) => (
                <SelectItem key={cd.classId} value={cd.classId?.toString() || ""}>
                  {cd.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 mb-4 mt-4">
          <Label>Select Exam Paper</Label>
          <Select onValueChange={handleSubjectSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Select Exam Paper" />
            </SelectTrigger>
            <SelectContent>
              {examPaperData?.map((f) => (
                <SelectItem key={f.subjectId} value={f.subjectId?.toString() || ""}>
                  {f.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      <AddResults
        students={studentData}
        examPaperId={examPaperId}
        refetch={handleRefetch}
      />
    </div>
  );
};

export default Page;
