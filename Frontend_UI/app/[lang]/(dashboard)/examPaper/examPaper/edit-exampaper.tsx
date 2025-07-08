"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { QuestionsData } from "@/services/apis/qBankService";
import { ExamPaperData, useDeleteExamPaperMutation, useUpdateExamPaperMutation } from "@/services/apis/examPaperService";

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const examPaperSchema = z.object({
  examPaperId: z.coerce.number().optional(),
  examPaperIds: z.array(z.coerce.number()).optional(),
  classId: z.coerce.number(),
  subjectId: z.coerce.number(),
  questionIds: z.array(z.coerce.number()),
  questions: z.string().optional(),
  totalMarks: z.number().min(1, "Total Marks are required"),
  writtenMarks: z.number().optional(),
  oralMarks: z.number().optional(),
  dictationMarks: z.number().optional(),
  copyMarks: z.number().optional(),
  termName: z.string().min(1, "Term is required"),
  isActive: z.boolean().optional().default(true),
});

type ExamFormValues = z.infer<typeof examPaperSchema>;

interface ExamProps{
  examPaperData: ExamPaperData[]
  examPaperItem: ExamPaperData[]
  questionData: QuestionsData[]
  refetch: () => void
}

export default function EditExamPaper({ examPaperData, examPaperItem, questionData, refetch }: ExamProps) {
  const [deleteExamPaper] = useDeleteExamPaperMutation();
  const [updateExamPaper] = useUpdateExamPaperMutation();
  const [writtensMarks, setWrittensMarks] = useState(0);
  const [totalsMarks, setTotalsMarks] = useState(0);
  const [isValidTotal, setIsValidTotal] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<ExamFormValues>({
    resolver: zodResolver(examPaperSchema),
    defaultValues: {
      classId: examPaperItem[0]?.classId,
      subjectId: examPaperItem[0]?.subjectId,
      totalMarks: examPaperItem[0]?.totalMarks,
      writtenMarks: examPaperItem[0]?.writtenMarks,
      oralMarks: examPaperItem[0]?.oralMarks,
      dictationMarks: examPaperItem[0]?.dictationMarks,
      copyMarks: examPaperItem[0]?.copyMarks,
      termName: examPaperItem[0]?.termName,
      questionIds: [],      
    },
  });
    
  const [rows, setRows] = useState<{ questionId: number | null; question: string; marks: number | null; examPaperId: number | null}[]>([
    { questionId: null, question: "", marks: null, examPaperId: null }
  ]);

  const selectedClassId = watch("classId");
  const selectedSubjectId = watch("subjectId");

  const filteredQuestions = questionData.filter(
    (questions) => questions.classId === selectedClassId && questions.subjectId === selectedSubjectId && questions.isActive);

  const filteredQuestionsExams = examPaperData.filter(
    (questions) => questions.classId === selectedClassId && questions.subjectId === selectedSubjectId && questions.isActive);
   
    useEffect(() => {
      if (examPaperItem.length > 0) {
        const { classId, subjectId } = examPaperItem[0]; 
  
        const filteredQuestions = examPaperData.filter(
          (question) =>
            question.classId === classId &&
            question.subjectId === subjectId &&
            question.isActive
        );
  
        const initialRows = filteredQuestions.map((question) => {
          return {
            questionId: question.questionIds[0],
            question: questionData.find((qd) => qd.questionBankId === question.questionIds[0])?.questions || "",
            marks: questionData.find((qd) => qd.questionBankId === question.questionIds[0])?.marks || 0,
            examPaperId: question.examPaperId || null,
          };
        });
  
        setRows(initialRows);

        const questionIds = filteredQuestions.map((q) => q.questionIds[0]);
        setValue("questionIds", questionIds);
      }
    }, [examPaperData, examPaperItem, questionData]);
    
   

  const handleQuestionSelection = (questionId: number, index: number) => {
    const question = questionData.find((q) => q.questionBankId === questionId);
    const updatedRows = [...rows];

    updatedRows[index] = {
      questionId,
      question: question?.questions || "",
      marks: question?.marks || 0,
      examPaperId: null,
    };

    setRows(updatedRows);

    const updatedQuestionIds = updatedRows.map((row) => row.questionId).filter((id) => id !== null);
    setValue("questionIds", updatedQuestionIds);
  };
  
  const addRow = () => {
    setRows((prev) => [...prev, { questionId: null, question: "", marks: null, examPaperId: null }]);
  };

const removeRow = async (index: number) => {
  const examPaperIdToRemove = rows[index].examPaperId;

  if (examPaperIdToRemove !== null) {
    console.log("Exam paper ID to remove:", examPaperIdToRemove);
    try {
      const response = await deleteExamPaper(examPaperIdToRemove);

      if (response.data?.success) {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);

        const updatedQuestionIds = updatedRows.map((row) => row.questionId).filter((id) => id !== null);
        setValue("questionIds", updatedQuestionIds);
        
        toast.success("Exam paper record removed successfully!");
      } else {
        toast.error("Failed to remove the exam paper record.");
      }
    } catch (error) {
      console.error("Error removing exam paper record:", error);
      toast.error("An error occurred while removing the exam paper record.");
    }
  } else {
    toast.error("No exam paper ID found to remove.");
  }
};

  useEffect(() => {
    const totalWrittenMarks = rows.reduce((acc, row) => {
      return acc + (row.marks ? row.marks : 0);
    }, 0);

    setWrittensMarks(totalWrittenMarks);
    setValue("writtenMarks", totalWrittenMarks);

    const oralMarks = watch("oralMarks") || 0;
    const dictationMarks = watch("dictationMarks") || 0;
    const copyMarks = watch("copyMarks") || 0;

    const total = totalWrittenMarks + oralMarks + dictationMarks + copyMarks;

    if (total > 100) {
      setIsValidTotal(false);
    } else {
      setIsValidTotal(true);
    }

    setTotalsMarks(total);
    setValue("totalMarks", total);
  }, [rows, watch("oralMarks"), watch("dictationMarks"), watch("copyMarks"), setValue]);
  
  const onSubmit: SubmitHandler<ExamFormValues> = async (data) => {
    console.log(data);
    if (!isValidTotal) {
      toast.error("Total marks must not exceed 100!");
      return;
    }

    try {
      const filteredExamPaperIds = filteredQuestionsExams.map((question) => question.examPaperId).filter((id) => id !== undefined) as number[];
      console.log(filteredExamPaperIds);
      const response = await updateExamPaper({...data, examPaperIds: filteredExamPaperIds,});
      if (response.data?.success) {
        toast.success(`${data.termName} ExamPaper Updated successfully!`);
        refetch();
        reset();
      } else {
        toast.error("Failed to update the ExamPaper");
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
  }; 


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className="flex h-4 w-4 " />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-[500px] overflow-y-auto" side="top">
        <SheetHeader>
          <SheetTitle>Edit Exam Paper</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
              <div className="col-span-4">
                  <Select 
                  defaultValue={watch("classId")?.toString() ?? ''}
                  onValueChange={(value) => setValue("classId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {examPaperItem.map((cd) => (
                        <SelectItem key={cd?.classId ?? ''} value={cd?.classId?.toString() ?? ''}>
                          {cd.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && <p className="text-destructive">{errors.classId.message}</p>}
                </div>

                <div className="col-span-4">
                  <Select defaultValue={watch("subjectId")?.toString() ?? ''}
                          onValueChange={(value) => setValue("subjectId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {examPaperItem.map((subjectData) => (
                        <SelectItem key={subjectData.subjectId} value={subjectData.subjectId.toString()}>
                          {subjectData.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && <p className="text-destructive">{errors.subjectId.message}</p>}
                </div>
                
                <div className="col-span-4">
                  <Select defaultValue={examPaperItem[0].termName}
                          onValueChange={(value) => setValue("termName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {examPaperItem.map((subjectData) => (
                        <SelectItem key={subjectData.termName} value={subjectData.termName}>
                          {subjectData.termName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && <p className="text-destructive">{errors.subjectId.message}</p>}
                </div>

                <SheetHeader className='col-span-12 mt-5'>
                  <SheetTitle className='text-blue-600'><i>Add Questions</i></SheetTitle>
                </SheetHeader>

                <hr className='col-span-12 mb-3'/>
                <div className="col-span-12 ">
                  {rows.map((row, index) => (
                    <div key={row.questionId} className="flex items-center gap-4 border-2 border-amber-300 ps-5 pe-5 pt-5 pb-5 mb-3">
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                          <Label>Select Question</Label>
                          <Select
                            value={row.questionId?.toString() ?? ""}
                            onValueChange={(value) => handleQuestionSelection(parseInt(value), index)}
                          >
                            <SelectTrigger className='h-20'>
                              <SelectValue placeholder={row.questionId ? "Question Selected" : "Select Question"} />
                            </SelectTrigger>

                            <SelectContent>
                              {filteredQuestions.map((q) => (
                                <SelectItem key={q.questionBankId?.toString() ?? ''} value={q?.questionBankId?.toString() ?? ''}>
                                  <div
                                    dangerouslySetInnerHTML={{  
                                      __html: (q.questions !== undefined && q.questions.length > 50 ? q.questions.slice(0, 25) + "..." : q.questions) || "",
                                    }}
                                  />
                                </SelectItem>
                              ))}
                            </SelectContent>

                            

                          </Select>
                          {errors.questionIds && <p className="text-destructive">{errors.questionIds.message}</p>}
                        </div>

                        <div className="col-span-5">
                          <Label>Preview Selected Question</Label>
                          <ReactQuill
                            value={row.question} 
                            readOnly={true}
                            modules={{ toolbar: false }}
                          />
                        </div>

                        <div className="col-span-2 font-bold">
                          <Label>Question Marks</Label>
                          <ReactQuill
                            value={row.marks !== null ? row.marks.toString() : "No Marks Available"}
                            readOnly={true}
                            modules={{ toolbar: false }}
                          />
                        </div>

                        <div className="col-span-1 mt-5 ">
                          <Button type="button" onClick={() => removeRow(index)} className='bg-red-400'>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-span-12 mt-4">
                    <Button type="button" onClick={addRow} className='bg-green-400'>
                      Add Row
                    </Button>
                  </div>
                </div>

                <SheetHeader className='col-span-12 mt-5'>
                  <SheetTitle className='text-blue-600'><i>Add Marks</i></SheetTitle>
                </SheetHeader>
                <hr className='col-span-12 mb-3'/>

                <div className="col-span-2 font-bold">
                  <Label>Written Marks</Label>
                  <Input
                    readOnly
                    placeholder="Written Marks"
                    {...register("writtenMarks", { valueAsNumber: true })}
                    value={examPaperItem[0].writtenMarks}
                  />
                  {errors.writtenMarks && (<p className="text-destructive"> {errors.writtenMarks.message}
                  </p>)}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Oral Marks</Label>
                  <Input
                    type="number"
                    placeholder="Oral Marks"
                    {...register("oralMarks", { valueAsNumber: true })}
                    defaultValue={0}
                  />
                  {errors.oralMarks && (<p className="text-destructive"> {errors.oralMarks.message}
                  </p>
                  )}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Dictation Marks</Label>
                  <Input
                    type="number"
                    placeholder="Dictation Marks"
                    {...register("dictationMarks", { valueAsNumber: true })}
                    defaultValue={0}
                  />
                  {errors.dictationMarks && (<p className="text-destructive"> {errors.dictationMarks.message}
                  </p>
                  )}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Copy Marks</Label>
                  <Input
                    type="number"
                    placeholder="Copy Marks"
                    {...register("copyMarks", { valueAsNumber: true })}
                    defaultValue={0}
                  />
                  {errors.copyMarks && (<p className="text-destructive"> {errors.copyMarks.message}
                  </p>
                  )}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    placeholder="Total Marks"
                    {...register("totalMarks", { valueAsNumber: true })}
                    defaultValue={0}
                    readOnly
                    className='text-lg'
                  />
                  {errors.totalMarks && (<p className="text-destructive"> {errors.totalMarks.message}
                  </p>
                  )}
                </div>

                <div className="col-span-1">
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
