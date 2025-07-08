import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface AssetAllocationData {
  allocationId?: number,
  itemId?: number,
  statusId?: number,
  quantity: number,
  allocatedByName?: string,
  allocatedTo: string,
  allocationDate?: string,
  itemName?: string,
  statusName?: string,
  allocatedLocation?: string,
  isActive?: boolean,
  createdBy?: number,
  createdAt?: Date,
}

export const assetsAllocationApi = createApi({
  reducerPath: "assetsAllocationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}AssetAllocation/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AssetAllocation"],

  endpoints: (builder) => ({
    fetchAllAllocatedAssets: builder.query<ApiResponse<AssetAllocationData[]>, void>({
      query: () => "GetAllAllocatedAssets",
      providesTags: ["AssetAllocation"],
    }),
    
    fetchAllocatedAssetById: builder.query<ApiResponse<AssetAllocationData>, number>({
      query: (id) => `GetAllocatedAssetById?id=${id}`,
    }),
    AllocateAsset: builder.mutation<ApiResponse<AssetAllocationData>, AssetAllocationData>({
      query: (assetAllocate) => ({
        url: "AllocateAsset",
        method: "POST",
        body: assetAllocate,
      }),
      invalidatesTags: ["AssetAllocation"],
    }),
    UpdateAllocatedAsset: builder.mutation<ApiResponse<void>, AssetAllocationData>({
      query: (assetAllocate) => ({
        url: "UpdateAllocatedAsset",
        method: "PUT",
        body: assetAllocate,
      }),
      invalidatesTags: ["AssetAllocation"],
    }),
    DeleteAllocatedAsset: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteAllocatedAsset?allocationId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetAllocation"],
    }),
  }),
});

export const {
useAllocateAssetMutation,
useDeleteAllocatedAssetMutation,
useFetchAllAllocatedAssetsQuery,
useFetchAllocatedAssetByIdQuery,
useUpdateAllocatedAssetMutation,
} = assetsAllocationApi;

export default assetsAllocationApi;
