import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

// Define the data structure
export interface EmployeeTrainingData {
  trainingId?: number;
  employeeId?: number;
  employeeName?: string;
  trainingName?: string;
  certification?:string;
  trainingDate?: string;
  createdBy?: number;
}

// Create the API slice
export const employeeTrainingApi = createApi({
  reducerPath: "trainingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Training`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployeeTraining: builder.query<ApiResponse, void>({
      query: () => "GetTraining",
    }),
    addEmployeeTraining: builder.mutation<ApiResponse, EmployeeTrainingData>({
      query: (data) => ({
        url: "AddTraining",
        method: "POST",
        body: data,
      }),
    }),
    updateEmployeeTraining: builder.mutation<ApiResponse, EmployeeTrainingData>({
      query: (data) => ({
        url: "UpdateTraining",
        method: "PUT",
        body: data,
      }),
    }),
    deleteEmployeeTraining: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteTraining?trainingId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useFetchEmployeeTrainingQuery,
  useAddEmployeeTrainingMutation,
  useUpdateEmployeeTrainingMutation,
  useDeleteEmployeeTrainingMutation,
} = employeeTrainingApi;

export default employeeTrainingApi;
