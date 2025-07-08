import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface PaymentData {
  paymentId?: number;
  sponsorshipId?: number;
  sponsorshipDetailId?: number;
  sponsorId?: number;
  sponsorName?: string;
  firstName?: string;
  lastName?: string;
  sponsorshipAmount?: number;
  paymentDate?: string;
  amountPaid?: number;
  paymentMethod?: string;
  totalPaid?: number;
  isActive?: boolean;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Payment/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSponsorPayments: builder.query<ApiResponse, void>({
      query: () => "GetAllPayments",
    }),
    addSponsorPayment: builder.mutation<ApiResponse, PaymentData>({
      query: (paymentData) => ({
        url: "AddPayment",
        method: "POST",
        body: paymentData,
      }),
    }),
    updateSponsorPayment: builder.mutation<ApiResponse, PaymentData>({
      query: (paymentData) => ({
        url: "UpdatePayment",
        method: "PUT",
        body: paymentData,
      }),
    }),
    deleteSponsorPayment: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeletePayment?paymentId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchSponsorPaymentsQuery,
  useAddSponsorPaymentMutation,
  useUpdateSponsorPaymentMutation,
  useDeleteSponsorPaymentMutation,
} = paymentApi;

export default paymentApi;
