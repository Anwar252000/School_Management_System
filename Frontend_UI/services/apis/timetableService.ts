import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface TimeTableData {
  timetableId?: number;
  campusId: number;
  classId: number;
  subjectId: number;
  periodId: number;
  dayOfWeek: string;
  periodName?: string;
  startTime?: string;
  endTime?: string;
  subjectName?: string;
  campusName?: string;
  className?: string;
}

export const timetableApi = createApi({
  reducerPath: "timetableApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}TimeTable/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    fetchTimeTable: builder.query<ApiResponse<TimeTableData[]>, void>({
      query: () => "GetTimeTables",
    }),
    fetchTimeTableById: builder.query<ApiResponse<TimeTableData>, number>({
      query: (id) => `GetTimeTableById/${id}`,
    }),
    addTimeTable: builder.mutation<ApiResponse<TimeTableData>, TimeTableData>({
      query: (TimeTableData) => ({
        url: "AddTimeTable",
        method: "POST",
        body: TimeTableData,
      }),
    }),
    updateTimeTable: builder.mutation<ApiResponse<void>, TimeTableData>({
      query: (TimeTableData) => ({
        url: "UpdateTimeTable",
        method: "PUT",
        body: TimeTableData,
      }),
    }),
    deleteTimeTable: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteTimeTable?timetableId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
useFetchTimeTableQuery,
useFetchTimeTableByIdQuery,
useAddTimeTableMutation,
useUpdateTimeTableMutation,
useDeleteTimeTableMutation,
} = timetableApi;

export default timetableApi;
