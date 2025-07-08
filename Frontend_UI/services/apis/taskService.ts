import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface TaskData {
  taskItemId?: number;
  taskName?: string;
  taskDescription?: string;
  beforeImage: FileList;
  afterImage: FileList;
  beforeImageUrl: string;
  afterImageUrl: string;
  priority?: string;
  assignedTo?: number;
  status?: string;
  startDate?: string;
  approvedByUserName?: string;
  assignedUserName?: string;
  endDate?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  approvedBy?: number;
  dateOfApproval?: string;
  notesAndRemarks?: string;
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}TaskItem/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchTasks: builder.query<ApiResponse, void>({
      query: () => "GetTask", // <-- Correct query definition
    }),
    addTask: builder.mutation<ApiResponse, TaskData>({
      query: (data) => ({
        url: "AssignTask",
        method: "POST",
        body: data,
      }),
    }),
    updateTask: builder.mutation<ApiResponse, TaskData>({
      query: (data) => ({
        url: "UpdateTask",
        method: "PUT",
        body: data,
      }),
    }),
    deleteTask: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteTask?taskId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;

export default taskApi;
