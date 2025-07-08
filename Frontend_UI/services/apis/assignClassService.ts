import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ClassAssignData {
  assignmentId?: number;
  campusId: number;
  classId: number; 
  classroomId: number; 
  sectionId: number;
  isActive?: boolean;
  campusName?: string;
}

export const classAssignApi = createApi({
  reducerPath: "classAssignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ClassSectionAssignment/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchClassAssignments: builder.query<ApiResponse<ClassAssignData[]>, void>({
      query: () => "GetAllClassAssignments",
    }),
    fetchClassAssignmentById: builder.query<ApiResponse<ClassAssignData>, number>({
      query: (id) => `GetClassSectionById/${id}`,
    }),
    addClassAssignment: builder.mutation<ApiResponse<ClassAssignData>, ClassAssignData>({
      query: (classData) => ({
        url: "AddClassSectionAssignment",
        method: "POST",
        body: classData,
      }),
    }),
    updateClassAssignment: builder.mutation<ApiResponse<void>, ClassAssignData>({
      query: (classData) => ({
        url: "UpdateClassSectionAssignment",
        method: "PUT",
        body: classData,
      }),
    }),
    deleteClassAssignment: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteClassSectionAssignment?assignmentId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchClassAssignmentsQuery,
  useFetchClassAssignmentByIdQuery,
  useAddClassAssignmentMutation,
  useUpdateClassAssignmentMutation,
  useDeleteClassAssignmentMutation,
} = classAssignApi;

export default classAssignApi;
