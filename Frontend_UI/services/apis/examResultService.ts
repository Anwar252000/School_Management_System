import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ExamResultData {
  examDetails?: ExamDetailsResultData[];
  subjectName?: string;
  className?: string;
  firstName?: string;
  lastName?: string;
  totalMarks?: number;
  isActive?: boolean;
}

export interface ExamDetailsResultData {
  examResultId?: number;
  studentId?: number;
  examPaperId?: number;
  marksObtained?: number;
  }

export const examResultApi = createApi({
  reducerPath: "examResultApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ExamResults/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExamResults: builder.query<ApiResponse<ExamResultData[]>, void>({
      query: () => "GetAllExamsResults",
    }),
    fetchExamResultsByClass: builder.query<ApiResponse<ExamResultData[]>, number>({
      query: (classId) => `GetExamResultsByClass?classId=${classId}`,
    }),
    fetchExamResultsByClassYearTerm: builder.query<
    ApiResponse<ExamResultData[]>,
    { classId?: number; year?: string; examPaperId?: number; termName?: string }
  >({
    query: ({ classId, year, examPaperId, termName }) =>
      `/GetExamResultsByClassTermYear?classId=${classId}&year=${year}&examPaperId=${examPaperId}&termName=${termName}`,
  }),
  
    addExamResult: builder.mutation<ApiResponse<ExamResultData>, ExamResultData>({
      query: (examResultData) => ({
        url: "AddExamResults",
        method: "POST",
        body: examResultData,
      }),
    }),
    updateExamResult: builder.mutation<ApiResponse<void>, ExamResultData>({
      query: (examResultData) => ({
        url: "UpdateExamResult",
        method: "PUT",
        body: examResultData,
      }),
    }),
    deleteResultExam: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteExamResult?examResultId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
useFetchExamResultsQuery,
useAddExamResultMutation,
useUpdateExamResultMutation,
useDeleteResultExamMutation,
useFetchExamResultsByClassQuery,
useFetchExamResultsByClassYearTermQuery
} = examResultApi;


export default examResultApi;
