"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAddParentFeedbackMutation } from "@/services/apis/parentFeedbackService";
import {
  useFetchParentsQuery,
  ParentData,
} from "@/services/apis/parentService";
import {
  useFetchStudentByParentIdQuery,
  StudentParentData,
} from "@/services/apis/studentParentService";
import { RootState } from "@/services/reduxStore";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const AddFeedback = () => {
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const { data: parent } = useFetchParentsQuery();
  const parentData = parent?.data as ParentData[];

  const { data: studentParent } = useFetchStudentByParentIdQuery(
    selectedParentId ?? 0
  );
  const studentParentData = studentParent?.data as StudentParentData[];

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addFeedback] = useAddParentFeedbackMutation();

  const dateSubmitted = new Date().toISOString().split("T")[0];

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedParentId || !studentId || !feedback.trim()) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const response = await addFeedback({
        feedbackText: feedback,
        studentId,
        parentId: selectedParentId,
        dateSubmitted,
        createdBy: loggedUser?.userId,
        isActive: true,
      }).unwrap();

      if (response.success) {
        toast.success("Feedback added successfully");
        setFeedback(""); // Reset feedback field after submission
        setSelectedParentId(null);
        setStudentId(null);
      } else {
        console.error("Error:", response);
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Request Failed:", error);
      toast.error("Request Failed");
    }

    console.log(selectedParentId, "parentId:");
    console.log(studentId, "studentId:");
    console.log(feedback, "feedback:");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="ml-auto flex items-center">
          <Icon icon="heroicons:clipboard" className="w-6 h-6 mr-2" />
          Add Feedback
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Parent Feedback</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">Add Feedback</h2>

              {/* Parent and Student Dropdowns */}
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <Label>Select Parent</Label>
                  <SearchableSelect
                    options={parentData?.map((pd) => ({
                      label: `${pd?.firstName} ${pd?.lastName}`,
                      value: pd?.parentId?.toString() || "", // Convert parentId to string
                    }))}
                    onValueChange={(value) =>
                      setSelectedParentId(parseInt(value) || null)
                    }
                  />
                </div>

                <div className="w-1/2">
                  <Label>Select Student</Label>
                  <SearchableSelect
                    options={parentData?.map((pd) => ({
                      label: (pd?.firstName || "") + " " + (pd?.lastName || ""), // Provide a default value if label is undefined
                      value: pd?.parentId?.toString() || "",
                    }))}
                    onValueChange={(value) =>
                      setStudentId(parseInt(value) || null)
                    }
                    disabled={!selectedParentId}
                  />
                </div>
              </div>

              {/* Feedback TextArea */}
              <div className="mb-4">
                <Label>Feedback</Label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Enter feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddFeedback;
