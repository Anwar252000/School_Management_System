import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface SponsorshipData {
  sponsorshipId?: number;
  sponsorId?: number;
  sponsorName?: string;
  gender?: string;
  phoneNumber?: string;
  amount?: number;
  frequency?: number;
  startDate?: string | Date;
  isActive?: boolean;
  createdBy?:number;
  details?: SponsorshipDataDetails[];
}

export interface SponsorshipDataDetails {
  sponsorshipDetailId?: number;
  sponsorshipId?: number;
  sponsorName?: string;
  studentId?: number;
  classId?: number | null;
  className?: string;
  studentName?: string;
  amount?: number;
  isActive?: boolean;
}

export const sponsorshipApi = createApi({
  reducerPath: "sponsorshipApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Sponsorship/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSponsorships: builder.query<ApiResponse, void>({
      query: () => "GetAllSponsorships",
    }),
    fetchSponsorshipDetail: builder.query<ApiResponse, void>({
      query: () => `GetAllSponsorshipDetails`,
    }),
    addSponsorship: builder.mutation<ApiResponse, SponsorshipData>({
      query: (sponsorshipData) => ({
        url: "AddSponsorship",
        method: "POST",
        body: sponsorshipData,
      }),
    }),
    updateSponsorship: builder.mutation<ApiResponse, SponsorshipData>({
      query: (sponsorshipData) => ({
        url: "UpdateSponsorship",
        method: "PUT",
        body: sponsorshipData,
      }),
    }),
    deleteSponsorship: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteSponsorship?sponsorshipId=${id}`,
        method: "DELETE",
      }),
    }),
    fetchStudentBySponsorId: builder.query<ApiResponse, number>({
      query: (id) => `GetAllStudentBySponsorId?sponsorId=${id}`,
    }),
  }),
});

export const {
  useFetchSponsorshipsQuery,
  useAddSponsorshipMutation,
  useUpdateSponsorshipMutation,
  useDeleteSponsorshipMutation,
  useFetchStudentBySponsorIdQuery,
  useFetchSponsorshipDetailQuery
} = sponsorshipApi;

export default sponsorshipApi;