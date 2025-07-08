import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface ExamData {
  examId?: number;
  examPaperId: number;
  campusId: number;
  classId: number;
  subjectId: number;
  passingMarks: number;
  campusName?: string;
  className?: string;
  subjectName?: string;
  termName?: string;
  examDate: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export const examApi = createApi({
  reducerPath: "examApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Exams/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExam: builder.query<ApiResponse<ExamData[]>, void>({
      query: () => "GetAllExams",
    }),
    fetchExamById: builder.query<ApiResponse<ExamData>, number>({
      query: (id) => `GetExamById/${id}`,
    }),
    addExam: builder.mutation<ApiResponse<ExamData>, ExamData>({
      query: (examData) => ({
        url: "AddExams",
        method: "POST",
        body: examData,
      }),
    }),
    updateExam: builder.mutation<ApiResponse<void>, ExamData>({
      query: (examData) => ({
        url: "UpdateExam",
        method: "PUT",
        body: examData,
      }),
    }),
    deleteExam: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteExam?examId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchExamQuery,
  useFetchExamByIdQuery,
  useAddExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;

export default examApi;
