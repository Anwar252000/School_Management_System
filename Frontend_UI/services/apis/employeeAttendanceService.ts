import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface EmployeeAttendanceData {
  employeeAttendanceId?: number;
  attendanceDate?: string | Date;
  attendanceStatus?: string;
  employeeName?: string;
  employeeId?: number;
  campusId?: number;
  campusName?: string;
  createdBy?: number;
  isActive?: boolean;
}

export const employeeAttendanceApi = createApi({
  reducerPath: "employeeAttendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}EmployeeAttendance/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployeeAttendance: builder.query<
      ApiResponse<EmployeeAttendanceData[]>,
      void
    >({
      query: () => "GetEmployeeAttendance",
    }),
    fetchEmployeeAttendanceById: builder.query<
      ApiResponse<EmployeeAttendanceData>,
      number
    >({
      query: (id) => `GetEmployeeAttendanceById/${id}`,
    }),
    
    fetchEmployeeAttendanceByDate: builder.query<
      ApiResponse<EmployeeAttendanceData[]>,
      {attendanceDate: string | Date }
    >({
      query: ({attendanceDate }) =>
        `GetEmployeeAttendanceByDate?attendanceDate=${attendanceDate}`,
    }),
    addEmployeeAttendance: builder.mutation<
      ApiResponse<EmployeeAttendanceData>,
      EmployeeAttendanceData[]
    >({
      query: (employeeAttendanceData) => ({
        url: "AddEmployeeAttendance",
        method: "POST",
        body: employeeAttendanceData,
      }),
    }),
    updateEmployeeAttendance: builder.mutation<
      ApiResponse<void>,
      EmployeeAttendanceData
    >({
      query: (employeeAttendanceData) => ({
        url: "UpdateEmployeeAttendance",
        method: "PUT",
        body: employeeAttendanceData,
      }),
    }),
    deleteEmployeeAttendance: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteEmployeeAttendance?attendanceId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchEmployeeAttendanceQuery,
  useFetchEmployeeAttendanceByIdQuery,
  useFetchEmployeeAttendanceByDateQuery,
  useAddEmployeeAttendanceMutation,
  useUpdateEmployeeAttendanceMutation,
  useDeleteEmployeeAttendanceMutation,
} = employeeAttendanceApi;


export default employeeAttendanceApi;
