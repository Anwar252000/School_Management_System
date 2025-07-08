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
import { QuestionsData, useUpdateQuestionMutation } from "@/services/apis/qBankService";

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const questionSchema = z.object({
  classId: z.coerce.number().min(1, "Class is required"),
  subjectId: z.coerce.number().min(1, "Subject is required"),
  questionType: z.string().min(1, "Question Type is required"),
  questions: z.string().min(1, "Questions is required"),
  marks: z.coerce.number().min(1, "Marks are required"),
});

type SubjectFormValues = z.infer<typeof questionSchema>;

export default function EditQuestions({ question, refetch }: {
  question: QuestionsData[];
  refetch: () => void
}) {
  
  const [isClient, setIsClient] = useState(false);
  const [updateQuestion] = useUpdateQuestionMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {questionBankId, classId, subjectId, questionType, questions, marks } = question[0];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SubjectFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      classId,
      subjectId,
      questionType,
      questions,
      marks
    },
  });

  const onSubmit: SubmitHandler<SubjectFormValues> = async (data) => {
    try {
      const updatedQuestion = { ...data, questionBankId };
      const response = await updateQuestion(updatedQuestion);
      if (response.data?.success) {
        toast.success(`${updatedQuestion.questionType} Updated successfully!`);
        refetch();
        reset();
      } else {
        toast.error("Failed to update the Question");
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
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Question</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Select onValueChange={(value) => setValue("classId", parseInt(value))}
                    defaultValue={classId.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {question.map((qs) => (
                        <SelectItem key={qs?.classId ?? ''} value={qs?.classId?.toString() ?? ''}>
                          {qs.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <Select onValueChange={(value) => setValue("subjectId", parseInt(value))}
                    defaultValue={subjectId.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {question.map((qs) => (
                        <SelectItem key={qs?.subjectId ?? ''} value={qs?.subjectId?.toString() ?? ''}>
                          {qs.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <Select onValueChange={(value) => setValue("questionType", value)}
                    defaultValue={questionType}
                    >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {question.map((qs) => (
                        <SelectItem key={qs?.questionType ?? ''} value={qs?.questionType ?? ''}>
                          {qs.questionType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <Input
                    type="number"
                    placeholder="Total Marks"
                    {...register("marks", { valueAsNumber: true })}
                  />
                  {errors.marks && (<p className="text-destructive"> {errors.marks.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                {/* <Label>Type Your Question</Label> */}
                  <ReactQuill
                    defaultValue={questions}
                    onChange={(value) => {
                      setValue("questions", value); 
                    }}
                    modules={{
                      toolbar: [
                        [{ header: '1'}, { header: '2'}, { font: [] }],
                        [{ list: 'ordered'}, { list: 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        [{ align: [] }],
                        ['link', 'image'],
                      ],
                    }}
                  />
                  {errors.questions && (<p className="text-destructive">{errors.questions.message}</p>)}
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
