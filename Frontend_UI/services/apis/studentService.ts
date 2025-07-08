import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface StudentData {
  studentId: number;
  grNo?: number;
  firstName?: string;
  lastName?: string;
  // studentName?: string;
  sectionId?: number;
  sectionName?: string;
  profileImage?: string | null;
  email?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string | Date;
  enrollmentDate?: Date | string;
  className?: string;
  classId?: number | null;
  campusId?: number;
  isActive: boolean;
}

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Students/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchStudent: builder.query<ApiResponse<StudentData[]>, void>({
      query: () => "GetAllStudents",
    }),
    fetchStudentByClassWise: builder.query<ApiResponse<StudentData>, number>({
      query: (id) => `GetStudentsClassWise?classId=${id}`,
    }),
    fetchStudentByClassSection: builder.query<ApiResponse<StudentData[]>, { classId: number; sectionId?: number }>({
      query: ({ classId, sectionId }) => `GetAllStudentByClassAndSection?classId=${classId}&sectionId=${sectionId}`,
    }),
    
    
    updateStudent: builder.mutation<ApiResponse<void>, StudentData>({
      query: (studentData) => ({
        url: "UpdateStudentData",
        method: "PUT",
        body: studentData,
      }),
    }),
    deleteStudent: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteStudent?studentId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchStudentQuery,
  useFetchStudentByClassWiseQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useFetchStudentByClassSectionQuery,
} = studentApi;

export default studentApi;
