import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface DashboardData {
  totalSponsors: number;
  totalEmployees: number;
  totalStudents: number;
  newSponsorsThisMonth: number;
  newEmployeesThisMonth: number;
  newStudentsThisMonth: number;
  sponsorStudent: number;
  maleStudents: number;
  femaleStudents: number;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
       baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}DashboardCountView`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchDashboardCount: builder.query<ApiResponse, void>({
      query: () => "GetDashboardCounts",
    }),
  }),
});

export const { useFetchDashboardCountQuery } = dashboardApi;

export default dashboardApi;
