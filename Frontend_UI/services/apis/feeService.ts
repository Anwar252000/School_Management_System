import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

// DTO for viewing fee data
export interface FeeViewData {
  studentId?: number;
  fullName?: string;
  campusName?: string;
  voucherId?: number;
  feeMonth?: string;
  feeYear?: number;
  totalFees?: number;
  grNo?: string;
  name?: string;
  paidAmount?: number;
  pendingAmount?: number;
  dueDate?: string;
  paymentStatus?: string;
  discountAmount?: number;
  sponsorName?: string;
}

// DTO for applying discount
export interface ApplyDiscountDto {
  studentId?: number;
  discountAmount?: number;
  reason?: string;
}

export const feeApi = createApi({
  reducerPath: "feeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Fee/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // POST: Assign fees to students
    assignFees: builder.mutation<ApiResponse<string>, void>({
      query: () => ({
        url: "AssignFees",
        method: "POST",
      }),
    }),

    // POST: Apply discount
    applyDiscount: builder.mutation<ApiResponse<string>, ApplyDiscountDto>({
      query: (dto) => ({
        url: "ApplyDiscount",
        method: "POST",
        body: dto,
      }),
    }),

    // GET: Get student fee summary
    fetchStudentFees: builder.query<ApiResponse<FeeViewData>, void>({
      query: () => "GetStudentFees",
    }),

    // GET: Get all detailed student fee data
    fetchAllStudentFeeDetail: builder.query<ApiResponse<FeeViewData[]>, void>({
      query: () => "GetAllStudentFeeDetail",
    }),
  }),
});

export const {
  useAssignFeesMutation,
  useApplyDiscountMutation,
  useFetchStudentFeesQuery,
  useFetchAllStudentFeeDetailQuery,
} = feeApi;

export default feeApi;
