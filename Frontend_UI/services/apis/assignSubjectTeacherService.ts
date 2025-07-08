import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface SubjectTeacherData {
  subjectTeacherId?: number | undefined;
  employeeId: number;
  employeeRoleName?: string;
  employeeName?: string;
  subjectIds: number[];
  subjects?: string[];
  isActive?: boolean;
}

export const assignSubjectTeacherApi = createApi({
  reducerPath: "assignSubjectTeacherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}SubjectTeacherAssignment/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSubjectTeacher: builder.query<ApiResponse<SubjectTeacherData[]>, void>({
      query: () => "GetAllSubjectTeacher",
    }),
    // fetchSubjectTeacherById: builder.query<ApiResponse<AssignSubjectTeacherData>, number>({
    //   query: (id) => `GetClassSubjectById/${id}`,
    // }),
    addSubjectTeacher: builder.mutation<ApiResponse<SubjectTeacherData>, SubjectTeacherData>({
      query: (subjectTeacherData) => ({
        url: "AddSubjectTeacher",
        method: "POST",
        body: subjectTeacherData,
      }),
    }),
    updateSubjectTeacher: builder.mutation<ApiResponse<void>, SubjectTeacherData>({
      query: (subjectTeacherData) => ({
        url: "UpdateSubjectTeacher",
        method: "PUT",
        body: subjectTeacherData,
      }),
    }),
    deleteSubjectTeacher: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteSubjectTeacher?employeeId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchSubjectTeacherQuery,
  useAddSubjectTeacherMutation,
  useUpdateSubjectTeacherMutation,
  useDeleteSubjectTeacherMutation
} = assignSubjectTeacherApi;

export default assignSubjectTeacherApi;
