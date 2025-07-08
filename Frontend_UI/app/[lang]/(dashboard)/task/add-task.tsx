"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { TaskData, useAddTaskMutation } from "@/services/apis/taskService";
import { UserData } from "@/services/apis/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

interface AddTaskProps {
  refetch: () => void;
  users: UserData[];
}

const AddTask: React.FC<AddTaskProps> = ({ refetch, users }) => {
  const [assignTask] = useAddTaskMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskData>();

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [approvedBy, setApprovedBy] = useState("");

  const onSubmit: SubmitHandler<TaskData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("taskName", data.taskName || "");
      formData.append("taskDescription", data.taskDescription || "");
      formData.append("priority", priority);
      formData.append("assignedTo", assignedTo);
      formData.append("status", status);
      formData.append("startDate", data.startDate || "");
      formData.append("endDate", data.endDate || "");
      formData.append("approvedBy", approvedBy);
      formData.append("createdBy", `${loggedUser?.userId}`);
      formData.append("notesAndRemarks", data.notesAndRemarks || "");

      if (data.beforeImage?.[0]) {
        formData.append("beforeImage", data.beforeImage[0]);
      }

      if (data.afterImage?.[0]) {
        formData.append("afterImage", data.afterImage[0]);
      }
      const response = await assignTask(formData as any); // as any if RTK Query mutation expects FormData
      if (response.data?.success) {
        toast.success("Task added successfully!");
        reset();
        setAssignedTo("");
        setApprovedBy("");
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error("Failed to submit task.");
    }
  };

  return (
    <Sheet>
      <div className="flex justify-end mb-4">
        <SheetTrigger asChild>
          <Button>
            <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent className="max-w-[736px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-indigo-700 text-xl font-semibold">
            Assign New Task
          </SheetTitle>
        </SheetHeader>

        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Description */}
              <div className="col-span-2">
                <Label>Task</Label>
                <Input
                  {...register("taskDescription", {
                    required: "Task is required",
                  })}
                  placeholder="Task Description"
                  className="bg-gray-50"
                />
                {errors.taskDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.taskDescription.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To */}
              <div>
                <Label>Assign To</Label>
                <Select
                  value={assignedTo}
                  onValueChange={(value) => setAssignedTo(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem
                        className="hover:bg-default-300"
                        key={user.userId}
                        value={user.userId?.toString() ?? ""}
                      >
                        {user.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Canceled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <Label>Assigned Date</Label>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="bg-gray-50"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <Label>Completion Date</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="bg-gray-50"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {/* Approved By */}
              <div className="col-span-2">
                <Label>Approved By</Label>
                <Select
                  value={approvedBy}
                  onValueChange={(value) => setApprovedBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem
                        className="hover:bg-default-300"
                        key={user.userId}
                        value={user.userId?.toString() ?? ""}
                      >
                        {user.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  {...register("notesAndRemarks")}
                  placeholder="Additional notes or remarks"
                  className="bg-gray-50"
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <Label>Before Completion</Label>
                <Input
                  type="file"
                  {...register("beforeImage")}
                  className="bg-white"
                />
              </div>
              {/* <div className="col-span-2">
                <Label>After Completion</Label>
                <Input
                  type="file"
                  {...register("afterImage")}
                  className="bg-white"
                />
              </div> */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="btn btn-primary">
                Add
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTask;
