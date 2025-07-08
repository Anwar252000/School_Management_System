import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface ExamPaperPDFData {
  examPaperId?: number;
  classId: number;
  subjectId: number;
  questionIds: number[];
  subjectName?: string;
  className?: string;
  totalMarks: number;
  writtenMarks?: number;
  dictationMarks?: number;
  oralMarks?: number;
  copyMarks?: number;
  termName: string;
  isActive?: boolean;
}

export const examPaperPDFApi = createApi({
  reducerPath: "examPaperPDFApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ExamPaperPDF/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExamPaperPDF: builder.query<Blob, {classId: number; subjectId: number}>({
      query: ({ classId, subjectId }) => ({
        url: "GeneratePdf",
        method: "GET",
        params: { classId, subjectId }, 
        responseHandler: (response) => response.blob()
      }),
     
    })
  }),
});

export const { useFetchExamPaperPDFQuery } = examPaperPDFApi;

export default examPaperPDFApi;
