"use client";

import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useFetchTasksQuery, TaskData } from "@/services/apis/taskService";
import AddTask from "./add-task";
import TaskTable from "./task-table";
import { useFetchUsersQuery, UserData } from "@/services/apis/userService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

const Page = () => {
  const { data: taskData, refetch: taskRefetch } = useFetchTasksQuery();
  const tasks = taskData?.data as TaskData[];
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const filteredTasks = tasks?.filter((task: TaskData) => {
    if (loggedUser?.userRoleName === "Admin") {
      return true; // Show all tasks for admin
    }
    return task.assignedTo === loggedUser?.userId; // Show only assigned tasks for others
  });

  const { data: users } = useFetchUsersQuery();
  const usersList = users?.data as UserData[];

  const handleRefetch = () => {
    taskRefetch();
  };

  return (
    <React.Fragment>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Task Management</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Tasks</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <AddTask refetch={handleRefetch} users={usersList} />
        <TaskTable
          loggedUser={loggedUser}
          tasks={filteredTasks}
          users={usersList}
          refetch={handleRefetch}
        />
      </div>
    </React.Fragment>
  );
};

export default Page;
