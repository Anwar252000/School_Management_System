import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

// Define the Book Purchase data structure
export interface BookPurchaseData {
  bookPurchaseId?: number;
  bookId?: number;
  bookTitle?: string;
  purchasedBy: string;
  purchaseDate?: string;
  createdBy?: number;
  quantity: number;
  price: number;
  isActive?:boolean;
}

export const bookPurchaseApi = createApi({
  reducerPath: "bookPurchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}BookPurchase/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ["BookPurchase"],

  endpoints: (builder) => ({
    fetchBookPurchases: builder.query<ApiResponse<BookPurchaseData[]>, void>({
      query: () => "GetPurchase",
      providesTags: ["BookPurchase"],
    }),

    addBookPurchase: builder.mutation<ApiResponse<BookPurchaseData>, Omit<BookPurchaseData, "bookPurchaseId">>({
      query: (purchase) => ({
        url: "AddPurchase",
        method: "POST",
        body: purchase,
      }),
      invalidatesTags: ["BookPurchase"],
    }),

    updateBookPurchase: builder.mutation<ApiResponse<void>, BookPurchaseData>({
      query: (purchase) => ({
        url: "UpdatePurchase",
        method: "PUT",
        body: purchase,
      }),
      invalidatesTags: ["BookPurchase"],
    }),

    deleteBookPurchase: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeletePurchase?Id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookPurchase"],
    }),
  }),
});

// Export auto-generated hooks
export const {
  useFetchBookPurchasesQuery,
  useAddBookPurchaseMutation,
  useUpdateBookPurchaseMutation,
  useDeleteBookPurchaseMutation,
} = bookPurchaseApi;

export default bookPurchaseApi;
