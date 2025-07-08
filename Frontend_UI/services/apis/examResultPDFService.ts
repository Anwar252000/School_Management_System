import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export interface ExamPaperPDFData {
//   examPaperId?: number;
//   classId: number;
//   subjectId: number;
//   questionIds: number[];
//   subjectName?: string;
//   className?: string;
//   totalMarks: number;
//   writtenMarks?: number;
//   dictationMarks?: number;
//   oralMarks?: number;
//   copyMarks?: number;
//   termName: string;
//   isActive?: boolean;
// }

export const examResultPDFApi = createApi({
  reducerPath: "examResultPDFApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ExamResultPDF/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExamResultPDF: builder.query<Blob, {studentId: number}>({
      query: ({ studentId }) => ({
        url: "GeneratePdf",
        method: "GET",
        params: { studentId }, 
        responseHandler: (response) => response.blob()
      }),
     
    })
  }),
});

export const { useFetchExamResultPDFQuery } = examResultPDFApi;

export default examResultPDFApi;
