import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface BookCategoryData {
  bookCategoryId?: number;
  categoryName?: string;
  isActive?: boolean;
  createdBy?: number;
  description?:string;
  createdAt?: string;
}

export const bookCategoryApi = createApi({
  reducerPath: "bookCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}BookCategory/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["BookCategory"],

  endpoints: (builder) => ({
    fetchBookCategories: builder.query<ApiResponse<BookCategoryData[]>, void>({
      query: () => "GetCategory",
      providesTags: ["BookCategory"],
    }),


    addBookCategory: builder.mutation<ApiResponse<BookCategoryData>, BookCategoryData>({
      query: (bookCategoryData) => ({
        url: "AddCategory",
        method: "POST",
        body: bookCategoryData,
      }),
      invalidatesTags: ["BookCategory"],
    }),

    updateBookCategory: builder.mutation<ApiResponse<void>, BookCategoryData>({
      query: (bookCategoryData) => ({
        url: "UpdateCategory",
        method: "PUT",
        body: bookCategoryData,
      }),
      invalidatesTags: ["BookCategory"],
    }),

    deleteBookCategory: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteCategory?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookCategory"],
    }),
  }),
});

export const {
  useFetchBookCategoriesQuery,
  useAddBookCategoryMutation,
  useUpdateBookCategoryMutation,
  useDeleteBookCategoryMutation,
} = bookCategoryApi;

export default bookCategoryApi;
