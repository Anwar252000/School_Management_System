import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import { number } from "zod";

export interface StudentParentData {
  studentParentId?: number;
  studentName?: string;
  parentName?: string;
  studentId?: number;
  parentId?: number;
  createdBy?:number;
  isActive?: boolean;
}

export const studentParentApi = createApi({
  reducerPath: "studentParentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}StudentParent/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    fetchStudentByParentId: builder.query<ApiResponse<StudentParentData[]>, number>({
      query: (parentId) =>  `GetStudentByParentId?parentId=${parentId}`,
    }),
   
})
});
export const {
  useFetchStudentByParentIdQuery,
 } = studentParentApi;

export default studentParentApi;
