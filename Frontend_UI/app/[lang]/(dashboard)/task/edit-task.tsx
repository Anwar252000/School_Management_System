import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TaskData, useUpdateTaskMutation } from "@/services/apis/taskService";
import { UserData } from "@/services/apis/userService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

interface EditTaskProps {
  task: TaskData;
  refetch: () => void;
  users: UserData[];
}
const EditTask: React.FC<EditTaskProps> = ({ task, refetch, users }) => {
  const [updateTask] = useUpdateTaskMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskData>();

  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [approvedBy, setApprovedBy] = useState("");
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (task) {
      const beforeImageFileList = new DataTransfer();
      const afterImageFileList = new DataTransfer();

      beforeImageFileList.items.add(
        new File([task.beforeImageUrl], "image.jpg", { type: "image/jpeg" })
      );

      afterImageFileList.items.add(
        new File([task.afterImageUrl], "image.jpg", { type: "image/jpeg" })
      );

      reset({
        taskDescription: task.taskDescription,
        startDate: task.startDate?.substring(0, 10),
        endDate: task.endDate?.substring(0, 10),
        notesAndRemarks: task.notesAndRemarks,
        beforeImageUrl: task.beforeImageUrl,
        afterImageUrl: task.afterImageUrl,
        assignedTo: task.assignedTo,
      });

      setAssignedTo(task.assignedTo?.toString() ?? "");
      setApprovedBy(task.approvedBy?.toString() ?? "");
      setPriority(task.priority ?? "Low");
      setStatus(task.status ?? "Pending");
    }
  }, [task, reset]);

  const onSubmit: SubmitHandler<TaskData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("taskItemId", task.taskItemId?.toString() ?? "");
      formData.append("taskDescription", data.taskDescription || "");
      formData.append("priority", priority);
      formData.append("assignedTo", assignedTo);
      formData.append("status", status);
      formData.append("startDate", data.startDate || "");
      formData.append("endDate", data.endDate || "");
      formData.append("approvedBy", approvedBy);
      formData.append("notesAndRemarks", data.notesAndRemarks || "");
      formData.append("updatedBy", `${loggedUser?.userId}`);

      if (data.beforeImage?.[0]) {
        formData.append("beforeImage", data.beforeImage[0]);
      }

      if (data.afterImage?.[0]) {
        formData.append("afterImage", data.afterImage[0]);
      }
      const response = await updateTask(formData as any); // as any if RTK Query mutation expects FormData
      if (response.data?.success) {
        toast.success("Task Updated successfully!");
        reset();
        setAssignedTo("");
        setApprovedBy("");
        refetch();
      } else {
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      toast.error("Failed to submit task.");
    }
  };

  return (
    <Sheet>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="h-7 w-7">
            <Icon icon="material-symbols:edit" className="w-4 h-4" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent className="max-w-[736px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-indigo-700 text-xl font-semibold">
            Update Task
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
                  placeholder="Task description"
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
                <Select value={priority} onValueChange={setPriority}>
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
                <Select value={assignedTo} onValueChange={setAssignedTo}>
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
                <Select value={status} onValueChange={setStatus}>
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
                <Select value={approvedBy} onValueChange={setApprovedBy}>
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
                {task.beforeImageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL_DOCUMENT}
                      ${task.beforeImageUrl}`}
                    alt="Before"
                    className="w-20 h-20 object-cover mb-2 rounded border"
                  />
                )}
                <Input
                  type="file"
                  {...register("beforeImage")}
                  className="bg-white"
                />
              </div>

              <div className="col-span-2">
                <Label>After Completion</Label>
                {task.afterImageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL_DOCUMENT}
                      ${task.afterImageUrl}`}
                    alt="After"
                    className="w-20 h-20 object-cover mb-2 rounded border"
                  />
                )}
                <Input
                  type="file"
                  {...register("afterImage")}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="btn btn-primary">
                Update
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditTask;
