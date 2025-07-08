import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface SponsorData {
  sponsorId?: number;
  sponsorName?: string;
  email?: string;
  gender?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  occupation?: string;
  postalCode?: number;
  address?: string;
  isActive?: boolean;
}

export const sponsorApi = createApi({
  reducerPath: "sponsorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Sponsors/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSponsors: builder.query<ApiResponse, void>({
      query: () => "GetAllSponsors",
    }),
    addSponsor: builder.mutation<ApiResponse, SponsorData>({
      query: (sponsorData) => ({
        url: "AddSponsor",
        method: "POST",
        body: sponsorData,
      }),
    }),
    updateSponsor: builder.mutation<ApiResponse, SponsorData>({
      query: (sponsorData) => ({
        url: "UpdateSponsor",
        method: "PUT",
        body: sponsorData,
      }),
    }),
    deleteSponsor: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteSponsor?sponsorId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchSponsorsQuery,
  useAddSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} = sponsorApi;

export default sponsorApi;
