import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface UserPermissionData {
  permissionId?: number;
  roleId?: number ;
  roleName?: string;
  userId?: number;
  userName?: string;
  entity?: string;
  entities?: any[];
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
}

export const userPermissionApi = createApi({
  reducerPath: "userPermissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}UserPermission/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserPermissions: builder.query<ApiResponse<UserPermissionData[]>, void>({
      query: () => "GetUserPermissions",
    }),

    fetchUserPermissionById: builder.query<ApiResponse<UserPermissionData>, number>({
      query: (id) => `GetUserPermissionByUserId?userId=${id}`,
    }),

    addUserPermission: builder.mutation<ApiResponse<UserPermissionData>, UserPermissionData>({
      query: (userData) => ({
        url: "AddUserPermission",
        method: "POST",
        body: userData,
      }),
    }),
    
    updateUserPermission: builder.mutation<ApiResponse<void>, UserPermissionData>({
      query: (userPermissionData) => ({
        url: "updateUserPermission",
        method: "PUT",
        body: userPermissionData,
      }),
    }),

    deleteUserPermission: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteUserPermission?userId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchUserPermissionsQuery,
  useFetchUserPermissionByIdQuery,
  useAddUserPermissionMutation,
  useUpdateUserPermissionMutation,
  useDeleteUserPermissionMutation,
} = userPermissionApi;

export default userPermissionApi;
