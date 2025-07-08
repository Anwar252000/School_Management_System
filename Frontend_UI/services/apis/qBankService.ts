import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface QuestionsData {
  questionBankId?: number;
  classId: number;
  subjectId: number;
  subjectName?: string;
  className?: string;
  questionType: string;
  questions?: string;
  marks: number;
  isActive?: boolean;
}

export const questionBankApi = createApi({
  reducerPath: "questionBankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Questions/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchQuestions: builder.query<ApiResponse<QuestionsData[]>, void>({
      query: () => "GetAllQuestions",
    }),
    addQuestion: builder.mutation<ApiResponse<QuestionsData>, QuestionsData>({
      query: (questionData) => ({
        url: "AddQuestions",
        method: "POST",
        body: questionData,
      }),
    }),
    updateQuestion: builder.mutation<ApiResponse<void>, QuestionsData>({
      query: (questionData) => ({
        url: "UpdateQuestion",
        method: "PUT",
        body: questionData,
      }),
    }),
    deleteQuestion: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteQuestion?questionId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
 useFetchQuestionsQuery,
 useAddQuestionMutation,
 useUpdateQuestionMutation,
 useDeleteQuestionMutation,
} = questionBankApi;

export default questionBankApi;
