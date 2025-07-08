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
} from "@/components/ui/sheet"; // Adjusted service import
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { ClassData } from "@/services/apis/classService";
import { AssignClassSubjectData } from "@/services/apis/assignClassSubjectService";
import { useAddQuestionMutation } from "@/services/apis/qBankService";
import { loggedUser } from "@/services/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const questionSchema = z.object({
  classId: z.coerce.number(),
  subjectId: z.coerce.number(),
  questionType: z.string().min(1, "Question Type is required"),
  questions: z
    .string()
    .min(1, "Questions is required")
    .max(10000, "Questions cannot exceed 10000 characters"),
  marks: z.number().min(1, "Marks are required"),
});

type QuestionsFormValues = z.infer<typeof questionSchema>;

interface QuestionProps {
  classes: ClassData[];
  subject: AssignClassSubjectData[];
  refetch: () => void;
}
export default function AddQuestions({
  subject,
  classes,
  refetch,
}: QuestionProps) {
  const [addQuestions] = useAddQuestionMutation();
  const [isClient, setIsClient] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuestionsFormValues>({
    resolver: zodResolver(questionSchema),
  });

  const selectedClassId = watch("classId");

  const filteredClassSubjects = subject?.filter(
    (subjects) => subjects.classId === selectedClassId && subjects.isActive
  );

  const onSubmit: SubmitHandler<QuestionsFormValues> = async (data) => {
    const formData = {
      ...data,
      createdBy: loggedUser?.userId,
    };
    try {
      const response = await addQuestions(data);
      if (response.data?.success) {
        toast.success(`${data.questionType} added successfully!`);
        refetch();
        reset();
      } else {
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      toast.error("Request Failed");
    }
  };

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
          Add a Question
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Question</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 mt-3 gap-4">
                <div className="col-span-1">
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
                      {classes?.map((cd) => (
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
                <div className="col-span-1">
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
                        <SelectItem
                          key={subjectData.subjectName}
                          value={subjectData.subjectIds?.toString() || ""}
                        >
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

                <div className="col-span-1">
                  <Label>Select Question Type</Label>
                  <Select
                    onValueChange={(value) => setValue("questionType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">MCQ</SelectItem>
                      <SelectItem value="Descriptive">Descriptive</SelectItem>
                      <SelectItem value="Short Questions">
                        Short Question
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.questionType && (
                    <p className="text-destructive">
                      {errors.questionType.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    placeholder="Question Marks"
                    {...register("marks", { valueAsNumber: true })}
                  />
                  {errors.marks && (
                    <p className="text-destructive"> {errors.marks.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label>Type Your Question</Label>
                  <ReactQuill
                    onChange={(value) => {
                      setValue("questions", value);
                    }}
                    modules={{
                      toolbar: [
                        [
                          { header: "1" },
                          { header: "2" },
                          { header: "3" },
                          { header: "4" },
                          { font: [] },
                        ],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        [{ align: [] }],
                        ["link", "image"],
                      ],
                    }}
                  />
                  {errors.questions && (
                    <p className="text-destructive">
                      {errors.questions.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Submit Form</Button>
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
