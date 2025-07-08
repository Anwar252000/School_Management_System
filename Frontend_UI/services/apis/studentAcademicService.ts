import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface StudentAcademicData {
  studentAcademicId?: number | null;
  studentId: number;
  studentName?: string;
  campusId?: number;
  sectionId?: number;
  classId?: number | null;
  className?: string;
  sectionName?: string;
  enrollmentDate?: Date | string;
  promotionDate?: Date | string;
 isPromoted?: boolean;
 academicYear?: string;
 remarks?: string;
 isStudied?: boolean;
 createdBy: number;
  isActive: boolean;
}

export const studentAcademicApi = createApi({
  reducerPath: "studentAcademicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}StudentAcademic/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchStudentAcademic: builder.query<ApiResponse<StudentAcademicData[]>, void>({
      query: () => "GetStudentAcademic",
    }),
    addStudentAcademic: builder.mutation<ApiResponse<StudentAcademicData>, StudentAcademicData>({
          query: (studentAcademicData) => ({
            url: "AddStudentAcademic",
            method: "POST",
            body: studentAcademicData,
          }),
        }),
    
    promoteStudentAcademic: builder.mutation<ApiResponse<StudentAcademicData>, StudentAcademicData>({
          query: (promoteStudentAcademicData) => ({
            url: "promoteStudentAcademic",
            method: "POST",
            body: promoteStudentAcademicData,
          }),
        }),
    
    updateStudentAcademic: builder.mutation<ApiResponse<void>, StudentAcademicData>({
      query: (studentAcademicData) => ({
        url: "UpdateStudentAcademic",
        method: "PUT",
        body: studentAcademicData,
      }),
    }),
    fetchPromotedStudentByClass: builder.query<ApiResponse<StudentAcademicData[]>, { classId: number; date: string }>({
          query: ({ classId, date }) => `GetPromotedStudentByClass?classId=${classId}&date=${date}`,
        }),
      
    deleteStudentAcademic: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteStudentAcademic?studentAcademicId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchStudentAcademicQuery,
  useAddStudentAcademicMutation,
  useUpdateStudentAcademicMutation,
  usePromoteStudentAcademicMutation,
  useDeleteStudentAcademicMutation,
  useFetchPromotedStudentByClassQuery,
} = studentAcademicApi;
export default studentAcademicApi;
  