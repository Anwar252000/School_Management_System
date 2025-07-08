import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TaskData, useDeleteTaskMutation } from "@/services/apis/taskService";
import EditTask from "./edit-task";
import { EmployeesData } from "@/services/apis/employeeService";
import { UserData } from "@/services/apis/userService";
import { Icon } from "@iconify/react";
import ConfirmationDialog from "../common/confirmation-dialog";
import { toast } from "sonner";

interface TaskProps {
  loggedUser: any;
  tasks: TaskData[];
  users: UserData[];
  refetch: () => void;
}
const TaskTable: React.FC<TaskProps> = ({
  loggedUser,
  tasks,
  users,
  refetch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deleteTask] = useDeleteTaskMutation();

  const filtered = tasks?.filter(
    (task: TaskData) =>
      task.taskDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.approvedByUserName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.assignedUserName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.notesAndRemarks?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.startDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.endDate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
      setTaskToDelete(null);
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border mt-3">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-3">
        <h2 className="text-2xl font-bold text-indigo-700">Task List</h2>
        <Input
          type="text"
          placeholder="Search Here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm border-gray-300 shadow-sm"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1500px]">
          <Table className="text-left border min-w-full">
            <TableHeader>
              <TableRow className="bg-indigo-50">
                <TableHead className="w-96">Task</TableHead>
                <TableHead className="w-52">Before Completion Img</TableHead>
                <TableHead className="w-24">Priority</TableHead>
                <TableHead className="w-52">Assigned To</TableHead>
                <TableHead className="w-48">Status</TableHead>
                <TableHead className="w-56">Assigned Date</TableHead>
                <TableHead className="w-56">Completion Date</TableHead>
                <TableHead className="w-52">After Completion Img</TableHead>
                <TableHead className="w-52">Approved By</TableHead>
                <TableHead className="w-52">Notes</TableHead>
                <TableHead>Update</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems?.map((task: TaskData) => (
                <TableRow key={task.taskItemId} className="hover:bg-gray-50">
                  <TableCell>{task.taskDescription}</TableCell>
                  <TableCell>
                    {task.beforeImageUrl ? (
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL_DOCUMENT +
                          task.beforeImageUrl
                        }
                        alt="Before Completion"
                        width={80}
                      />
                    ) : (
                      <Icon icon="heroicons:minus" className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      color={
                        task.priority === "Low"
                          ? "warning"
                          : task.priority === "Medium"
                          ? "info"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.assignedUserName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      color={
                        task.status === "Not Started"
                          ? "warning"
                          : task.status === "In-Progress"
                          ? "info"
                          : task.status === "Completed"
                          ? "success"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.startDate
                      ? new Date(task.startDate)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")
                      : "No assigned date"}
                  </TableCell>

                  <TableCell>
                    {task.endDate
                      ? new Date(task.endDate)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")
                      : "No completion date"}
                  </TableCell>
                  <TableCell>
                    {task.afterImageUrl ? (
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL_DOCUMENT +
                          task.afterImageUrl
                        }
                        alt="After Completion"
                        width={80}
                      />
                    ) : (
                      <Icon icon="heroicons:minus" className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell>{task.approvedByUserName}</TableCell>
                  <TableCell>{task.notesAndRemarks}</TableCell>
                  <TableCell className="flex gap-2">
                    <EditTask task={task} users={users} refetch={refetch} />
                    <Button
                      size="icon"
                      variant="outline"
                      color="destructive"
                      className="h-7 w-7"
                      onClick={() => setTaskToDelete(task.taskItemId ?? 0)}
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-gray-700">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
        >
          Next
        </Button>
      </div>
      {taskToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(taskToDelete)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
};

export default TaskTable;
