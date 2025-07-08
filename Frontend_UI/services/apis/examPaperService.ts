import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface ExamPaperData {
  examPaperId?: number;
  examPaperIds?: number[];
  classId: number;
  subjectId: number;
  questionIds: number[];
  questions?: string;
  subjectName?: string;
  className?: string;
  totalMarks: number;
  writtenMarks?: number;
  dictationMarks?: number;
  oralMarks?: number;
  copyMarks?: number;
  termName: string;
  createdAt?: Date;
  isActive?: boolean;
}

export const examPaperApi = createApi({
  reducerPath: "examPaperApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ExamPapers/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExamPapers: builder.query<ApiResponse<ExamPaperData[]>, void>({
      query: () => "GetAllExamPapers",
    }),
   
    addExamPaper: builder.mutation<ApiResponse<ExamPaperData>, ExamPaperData>({
      query: (examPaperData) => ({
        url: "AddExamPapers",
        method: "POST",
        body: examPaperData,
      }),
    }),
    updateExamPaper: builder.mutation<ApiResponse<void>, ExamPaperData>({
      query: (examPaperData) => ({
        url: "UpdateExamPaper",
        method: "PUT",
        body: examPaperData,
      }),
    }),
    deleteExamPaper: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteExamPaper?examPaperId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
 useFetchExamPapersQuery,
 useAddExamPaperMutation,
 useUpdateExamPaperMutation,
 useDeleteExamPaperMutation
} = examPaperApi;

export default examPaperApi;
