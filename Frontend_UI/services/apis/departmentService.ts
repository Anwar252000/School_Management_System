import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface DepartmentData {
  departmentId?: number | null;
  campusId?: number;
  campusName?: string | undefined;
  departmentName: string;
  description?: string;
  isActive?: true;
  // campus?: campusData;
}

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Departments/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchDepartments: builder.query<ApiResponse<DepartmentData[]>, void>({
      query: () => "GetDepartments",
    }),
    fetchDepartmentById: builder.query<ApiResponse<DepartmentData>, number>({
      query: (id) => `GetDepartmentById/${id}`,
    }),
    addDepartments: builder.mutation<ApiResponse<DepartmentData>, DepartmentData>({
      query: (departmentData) => ({
        url: "AddDepartment",
        method: "POST",
        body: departmentData,
      }),
    }),
    updateDepartment: builder.mutation<ApiResponse<void>, DepartmentData>({
      query: (departmentData) => ({
        url: "UpdateDepartment",
        method: "PUT",
        body: departmentData,
      }),
    }),
    deleteDepartment: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteDepartment?departmentId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchDepartmentsQuery,
  useFetchDepartmentByIdQuery,
  useAddDepartmentsMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation

} = departmentApi;

export default departmentApi;
