import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";



export interface EmployeesData {
  employeeId?: number;
  roleId?: number;
  employeeRoleName?: string;
  campusId?: number;
  campusName?: string;
  departmentId?: number;
  departmentName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  hireDate?: string;
  address?: string;
  emergencyContact?: string;
  qualifications?: string;
  isActive?: boolean;
}



export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Employee`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployees: builder.query<ApiResponse, void>({
      query: () => "GetEmployees",
    }),
    fetchEmployeeById: builder.query<EmployeesData, number>({
      query: (id) => `GetEmployeeById/${id}`,
    }),
    addEmployee: builder.mutation<ApiResponse, EmployeesData>({
      query: (employeeData) => ({
        url: "AddEmployee",
        method: "POST",
        body: employeeData,
      }),
    }),
    updateEmployee: builder.mutation<ApiResponse, EmployeesData>({
      query: (employeeData) => ({
        url: "UpdateEmployee",
        method: "PUT",
        body: employeeData,
      }),
    }),
    deleteEmployee: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteEmployee?employeeId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchEmployeesQuery,
  useFetchEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;

export default employeeApi;