import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";



export interface EmployeeLeaveData {
  employeeLeaveId?: number;
  employeeId?: number;
  employeeName?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  approvalStatus?: string;
  createdBy?: number;
  isActive?: boolean;
}

export const employeeLeaveApi = createApi({
  reducerPath: "employeeLeaveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}EmployeeLeave`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployeeLeave: builder.query<ApiResponse, void>({
      query: () => "GetEmployeeLeave",
   }),
    addEmployeeLeave: builder.mutation<ApiResponse, EmployeeLeaveData>({
      query: (data) => ({
        url: "AddEmployeeLeave",
        method: "POST",
        body: data,
      }),
    }),
    updateEmployeeLeave: builder.mutation<ApiResponse, EmployeeLeaveData>({
      query: (data) => ({
        url: `UpdateEmployeeLeave`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteEmployeeLeave: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteEmployeeLeave?employeeleaveId=${id}`,
        method: "DELETE",
      }),
    }),
 
})
  })
  export const {
    useFetchEmployeeLeaveQuery,
    useAddEmployeeLeaveMutation,
    useUpdateEmployeeLeaveMutation,
    useDeleteEmployeeLeaveMutation,
  } = employeeLeaveApi;
export default employeeLeaveApi;


