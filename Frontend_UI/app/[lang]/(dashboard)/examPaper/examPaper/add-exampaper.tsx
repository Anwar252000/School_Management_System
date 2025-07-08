"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from "next/dynamic";
import { ClassData } from "@/services/apis/classService";
import { AssignClassSubjectData } from "@/services/apis/assignClassSubjectService";
import { QuestionsData } from "@/services/apis/qBankService";
import { useAddExamPaperMutation, useFetchExamPapersQuery } from "@/services/apis/examPaperService";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const exampaperSchema = z.object({
  examPaperId: z.coerce.number().optional(),
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

type ExamFormValues = z.infer<typeof exampaperSchema>;

interface ExamProps {
  questionData: QuestionsData[];
  subjectData: AssignClassSubjectData[];
  classData: ClassData[];
  refetch: () => void
}
export default function ExamPaperTemplate({
  questionData,
  subjectData,
  classData,
  refetch
}: ExamProps) {
    
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]); // State to hold selected question ID
  // const [selectedQuestion, setSelectedQuestion] = useState<string[]>([]); // State to hold selected question content
  // const [selectedMarks, setSelectedMarks] = useState<number[]>([]);
  const [writtenMarks, setWrittenMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isValidTotal, setIsValidTotal] = useState(true);
  const [addExamPaper]  = useAddExamPaperMutation();

  const [rows, setRows] = useState<
    { questionId: number | null; question: string; marks: number | null }[]
  >([{ questionId: null, question: "", marks: null }]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { questionId: null, question: "", marks: null },
    ]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));

    setValue(
      "questionIds",
      rows
        .filter((_, i) => i !== index)
        .map((row) => row.questionId)
        .filter((id) => id !== null)
    );
  };

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(exampaperSchema),
  });

  const selectedClassId = watch("classId");
  const selectedSubjectId = watch("subjectId");

  const filteredClassSubjects = subjectData?.filter(
    (subjects) => {return subjects.classId === selectedClassId && subjects.isActive;
    }
    );

  const filteredQuestions = questionData?.filter(
    (questions) =>
      questions.classId === selectedClassId &&
      questions.subjectId === selectedSubjectId &&
      questions.isActive
  );

  const handleQuestionSelection = (questionId: number, index: number) => {
    const question = questionData.find((q) => q.questionBankId === questionId);
    if (question) {
      setRows((prev) => {
        const updatedRows = [...prev];
        updatedRows[index] = {
          questionId,
          question: question.questions || "",
          marks: question.marks || 0,
        };
        return updatedRows;
      });

      setValue(
        "questionIds",
        rows
          .map((row, i) => (i === index ? questionId : row.questionId))
          .filter((id) => id !== null)
      );
    }
  };

  const onSubmit: SubmitHandler<ExamFormValues> = async (data) => {
    console.log("Data Submitted", data);

    if (!isValidTotal) {
      toast.error("Total marks must not exceed 100!");
      return;
    }

    try {
      const finalData = { ...data, questionId: selectedQuestionIds };
      const response = await addExamPaper(finalData);
      if (data.questionIds.length === 0) {
        toast.error("Please select at least one question.");
        return;
      }
      if (response.data?.success) {
        toast.success(`Exam Paper for ${data.termName} added successfully!`);
        refetch();
        reset();
      } else {
        toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Request Failed");
    }
  };

  useEffect(() => {
    const totalWrittenMarks = rows.reduce((acc, row) => {
      return acc + (row.marks ? row.marks : 0);
    }, 0);

    setWrittenMarks(totalWrittenMarks);
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

    setTotalMarks(total);
    setValue("totalMarks", total);
  }, [
    rows,
    watch("oralMarks"),
    watch("dictationMarks"),
    watch("copyMarks"),
    setValue,
  ]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Exam Paper
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-[500px] overflow-y-auto" side="top">
        <SheetHeader className="text-base">
          <SheetTitle>Design Your Exam Paper</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-2">
            <hr />
            <SheetHeader className="col-span-12 mt-6 mb-3 ">
              <SheetTitle className="text-blue-600">
                <i> Select Class/Subject/Term</i>
              </SheetTitle>
            </SheetHeader>
            <hr className="mb-6" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 mt-3 gap-4">
                <div className="col-span-4">
                  <Label>Select Class</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("classId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classData?.map((cd) => (
                        <SelectItem
                          key={cd?.classId ?? ""}
                          value={cd?.classId?.toString() ?? ""}
                        >
                          {cd.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && (
                    <p className="text-destructive">{errors.classId.message}</p>
                  )}
                </div>

                <div className="col-span-4">
                  <Label>Select Subject</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("subjectId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClassSubjects?.map((subjectData) => (
                        <SelectItem key={subjectData?.subjectName} value={subjectData.subjectIds?.toString() || ''}>

                          {subjectData.subjectName}
                        </SelectItem>

                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && (
                    <p className="text-destructive">
                      {errors.subjectId.message}
                    </p>
                  )}
                </div>

                <div className="col-span-4">
                  <Label>Term Name</Label>
                  <Select
                    onValueChange={(value) => setValue("termName", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FirstTerm">First-Term</SelectItem>
                      <SelectItem value="MidTerm">Mid-Term</SelectItem>
                      <SelectItem value="FinalTerm">Final Term</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.termName && (
                    <p className="text-destructive">
                      {errors.termName.message}
                    </p>
                  )}
                </div>

                <SheetHeader className="col-span-12 mt-5">
                  <SheetTitle className="text-blue-600">
                    <i>Add Questions</i>
                  </SheetTitle>
                </SheetHeader>
                <hr className="col-span-12 mb-3" />
                <div className="col-span-12 ">
                  {rows.map((row, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-2 border-amber-300 ps-5 pe-5 pt-5 pb-5 mb-3"
                    >
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                          <Label>Select Question</Label>
                          <Select
                            onValueChange={(value) =>
                              handleQuestionSelection(parseInt(value), index)
                            }
                          >
                            <SelectTrigger className="h-20">
                              <SelectValue
                                placeholder={
                                  row.questionId
                                    ? "Question Selected"
                                    : "Select Question"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredQuestions?.map((q) => (
                                <SelectItem
                                  key={q.questionBankId}
                                  value={q.questionBankId?.toString() ?? ""}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        (q.questions !== undefined &&
                                        q.questions.length > 50
                                          ? q.questions.slice(0, 25) + "..."
                                          : q.questions) ?? "",
                                    }}
                                  />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.questionIds && (
                            <p className="text-destructive">
                              {errors.questionIds.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-5">
                          <Label>Preview Selected Question</Label>
                          <ReactQuill
                            value={row.question} // Display question content
                            readOnly={true}
                            modules={{ toolbar: false }}
                          />
                        </div>

                        <div className="col-span-2 font-bold">
                          <Label>Question Marks</Label>
                          <ReactQuill
                            value={
                              row.marks !== null
                                ? row.marks.toString()
                                : "No Marks Available"
                            }
                            readOnly={true}
                            modules={{ toolbar: false }}
                          />
                        </div>

                        <div className="col-span-1 mt-5 ">
                          <Button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="bg-red-400"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-span-12 mt-4">
                    <Button
                      type="button"
                      onClick={addRow}
                      className="bg-green-400"
                    >
                      Add Row
                    </Button>
                  </div>
                </div>

                <SheetHeader className="col-span-12 mt-5">
                  <SheetTitle className="text-blue-600">
                    <i>Add Marks</i>
                  </SheetTitle>
                </SheetHeader>
                <hr className="col-span-12 mb-3" />

                <div className="col-span-2 font-bold">
                  <Label>Written Marks</Label>
                  <Input
                    readOnly
                    placeholder="Written Marks"
                    {...register("writtenMarks", { valueAsNumber: true })}
                    value={writtenMarks}
                  />
                  {errors.writtenMarks && (
                    <p className="text-destructive">
                      {" "}
                      {errors.writtenMarks.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Oral Marks</Label>
                  <Input
                    type="number"
                    placeholder="Oral Marks"
                    {...register("oralMarks", { valueAsNumber: true })}
                    defaultValue={0}
                  />
                  {errors.oralMarks && (
                    <p className="text-destructive">
                      {" "}
                      {errors.oralMarks.message}
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
                  {errors.dictationMarks && (
                    <p className="text-destructive">
                      {" "}
                      {errors.dictationMarks.message}
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
                  {errors.copyMarks && (
                    <p className="text-destructive">
                      {" "}
                      {errors.copyMarks.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 font-bold">
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    placeholder="Total Marks"
                    {...register("totalMarks", { valueAsNumber: true })}
                    value={totalMarks}
                    readOnly
                    className="text-lg"
                  />
                  {errors.totalMarks && (
                    <p className="text-destructive">
                      {" "}
                      {errors.totalMarks.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 mt-5">
                  <Button type="submit">Save Exam Paper</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
