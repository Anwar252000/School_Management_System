"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { use, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionsReport from "./reports";
import AddQuestions from "./question/add-question";
import ExamPaperTemplate from "./examPaper/add-exampaper";
import AddScheduleExams from "./scheduleExam/add-schedule-exams";
import ExamScheduleTable from "./scheduleExam/examSchedule-table";
import { ExamData, useFetchExamQuery } from "@/services/apis/examService";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import { AssignClassSubjectData, useFetchClassSubjectQuery } from "@/services/apis/assignClassSubjectService";
import { QuestionsData, useFetchQuestionsQuery } from "@/services/apis/qBankService";
import ExamPaperTable from "./examPaper/exam-table";
import { ExamPaperData, useFetchExamPapersQuery } from "@/services/apis/examPaperService";

const QuestionBank = () => {
  const {data: subjectData, refetch: subjectRefetch} = useFetchClassSubjectQuery();
  const subjects = subjectData?.data as AssignClassSubjectData[];
  const {data: classData, isLoading, isError, refetch: classRefetch} = useFetchClassQuery();
  const classes = classData?.data as ClassData[];
  const {data: questionData, error: questionError, isLoading: questionLoading, refetch: questionRefetch} = useFetchQuestionsQuery();
  const questions = questionData?.data as QuestionsData[];
  const {data: exams, error: examError, isLoading: examLoading, refetch: examRefetch} = useFetchExamQuery();
  const examData = exams?.data as ExamData[];
  const {data: examPaperData, error: examPaperError, isLoading: examPaperLoading, refetch: examPaperRefetch} = useFetchExamPapersQuery();
  const examPaper = examPaperData?.data as ExamPaperData[];

  const handleRefetch = () => {
    examRefetch();
    subjectRefetch();
    classRefetch();
    questionRefetch();
    examPaperRefetch();
  };

  return (
    <div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Academic</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Question Bank</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddQuestions classes={classes} subject={subjects} refetch={handleRefetch}/>
          <ExamPaperTemplate questionData={questions} classData={classes} subjectData={subjects} refetch={handleRefetch}/>
          <AddScheduleExams classes={classes} subject={subjects} refetch={handleRefetch}/>
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="shadow-none rounded-none open">
          <AccordionTrigger>View Question Bank</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                <QuestionsReport Questions={questions} refetch={handleRefetch} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5 "
        defaultValue="item-2"
      >
        <AccordionItem value="item-2" className="shadow-none rounded-none open">
          <AccordionTrigger>Exam Schedule</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <ExamScheduleTable  examSchedule={examData} refetch={handleRefetch} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        defaultValue="item-3"
      >
        <AccordionItem value="item-2" className="shadow-none rounded-none open">
          <AccordionTrigger>View Exam Papers</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <ExamPaperTable  questionBank={questions} refetch={handleRefetch} examPaper={examPaper}/>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    
  
     
    </div>
  );
};

export default QuestionBank;
