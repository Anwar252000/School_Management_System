import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface BookData {
  bookId?: number;
  title?: string;
  author?: string;
  bookCategoryId: number;
  purchaseDate?: string;
  categoryName?: string;
  createdBy?: number;
  isActive: boolean;
  updatedBy?: number;
}

// New interface specifically for update payload (all required except optional fields)
export interface UpdateBookData {
  bookId: number;
  title: string;
  author: string;
  bookCategoryId: number;
  isActive: boolean;
  updatedBy: number;
}

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Book/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Book"],

  endpoints: (builder) => ({
    fetchBooks: builder.query<ApiResponse<BookData[]>, void>({
      query: () => "GetBook",
      providesTags: ["Book"],
    }),

    addBook: builder.mutation<ApiResponse<BookData>, BookData>({
      query: (bookData) => ({
        url: "AddBook",
        method: "POST",
        body: bookData,
      }),
      invalidatesTags: ["Book"],
    }),

    // Use UpdateBookData here for update mutation input
    updateBook: builder.mutation<ApiResponse<void>, UpdateBookData>({
      query: (bookData) => ({
        url: "UpdateBook",
        method: "PUT",
        body: bookData,
      }),
      invalidatesTags: ["Book"],
    }),

    deleteBook: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteBook?Id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useFetchBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;

export default bookApi;
