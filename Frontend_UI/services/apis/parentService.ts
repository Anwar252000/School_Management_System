import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ParentData {
  parentId?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  parentAddress?: string;
  residenceStatus?: string;
  occupation?: string
  sourceOfIncome?: string;
  dependent?: string;
  nationality?: string;
  motherTongue?: string;
  createdBy?:number;
  isActive?: boolean;
}

export const parentApi = createApi({
  reducerPath: "parentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Parent/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    fetchParents: builder.query<ApiResponse<ParentData[]>, void>({
      query: () => "GetParents",
    }),
    addParent: builder.mutation<ApiResponse<ParentData>, ParentData>({
      query: (ParentData) => ({
        url: "AddParent",
        method: "POST",
        body: ParentData,
      }),
    }),
    updateParent: builder.mutation<ApiResponse<void>, ParentData>({
      query: (ParentData) => ({
        url: "UpdateParent",
        method: "PUT",
        body: ParentData,
      }),
    }),
    deleteParent: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteParent?parentId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchParentsQuery,
  useAddParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
} = parentApi;

export default parentApi;
