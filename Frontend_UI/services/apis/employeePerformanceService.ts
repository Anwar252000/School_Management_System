import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";


export interface EmployeeAppraisalData {
  appraisalId?: number;
  employeeId?: number;
  employeeName?: string;
  performanceScore?:number;
  comments?:string;
  appraisalDate?: string;
  createdBy?: number;
}

export const employeeAppraisalApi = createApi({
  reducerPath: "employeeAppraisalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}PerformanceAppraisal`, 
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployeeAppraisal: builder.query<ApiResponse, void>({
      query: () => "GetPerformanceAppraisal", // <-- Update to match your backend
    }),
    addEmployeeAppraisal: builder.mutation<ApiResponse, EmployeeAppraisalData>({
      query: (data) => ({
        url: "AddPerformanceAppraisal",
        method: "POST",
        body: data,
      }),
    }),
    updateEmployeeAppraisal: builder.mutation<ApiResponse, EmployeeAppraisalData>({
      query: (data) => ({
        url: "UpdatePerformanceAppraisal",
        method: "PUT",
        body: data,
      }),
    }),
    deleteEmployeeAppraisal: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeletePerformanceAppraisal?appraisalId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchEmployeeAppraisalQuery,
  useAddEmployeeAppraisalMutation,
  useUpdateEmployeeAppraisalMutation,
  useDeleteEmployeeAppraisalMutation,
  
} = employeeAppraisalApi;

export default employeeAppraisalApi;
