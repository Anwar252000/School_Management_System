import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface StudentAttendanceData{ 

  attendanceId?: number;
  attendanceDate?: string | Date;
  attendanceStatus?: string;
  studentName?: string;
  className?: string;
  sectionName?: string;
  studentId?: number;
  grNo?: number;
  classId?: number;
  // campusId?: number;
  sectionId?: number;
  isActive?: boolean;



}

export const studentAttendanceApi = createApi({
  reducerPath: "studentAttendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}StudentAttendance/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchStudentAttendance: builder.query<ApiResponse<StudentAttendanceData[]>, void>({
      query: () => "GetStudentAttendance",
    }),
    fetchStudentAttendanceById: builder.query<ApiResponse<StudentAttendanceData>, number>({
      query: (id) => `GetStudentAttendanceById/${id}`,
    }),
    fetchStudentAttendanceByClassSectionId: builder.query<ApiResponse<StudentAttendanceData[]>, { classId: number; sectionId: number, attendanceDate: string | Date}>({
      query: ({ classId, sectionId, attendanceDate }) => `GetStudentAttendanceByClassSectionId?classId=${classId}&sectionId=${sectionId}&attendanceDate=${attendanceDate}`,
    }),
    addStudentAttendance: builder.mutation<ApiResponse<StudentAttendanceData>, StudentAttendanceData[]>({
      query: (studentAttendanceData) => ({
        url: "AddStudentAttendance",
        method: "POST",
        body: studentAttendanceData,
      }),
    }),
    updateStudentAttendance: builder.mutation<ApiResponse<void>, StudentAttendanceData>({
      query: (studentAttendanceData) => ({
        url: "UpdateStudentAttendance",
        method: "PUT",
        body: studentAttendanceData,
      }),
    }),
    deleteStudentAttendance: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteStudentAttendance?attendanceId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
useAddStudentAttendanceMutation, useFetchStudentAttendanceQuery,useDeleteStudentAttendanceMutation,useUpdateStudentAttendanceMutation, useFetchStudentAttendanceByIdQuery,
useFetchStudentAttendanceByClassSectionIdQuery,
} = studentAttendanceApi;

export default studentAttendanceApi;
