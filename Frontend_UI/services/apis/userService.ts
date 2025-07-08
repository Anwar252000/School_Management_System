import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import { UserPermissionData } from "./userPermissionService";
export interface UserData {
  userId?: number;
  userName?: string;
  token?: string;
  passwordHash?: string;
  roleId?: number;
  roleName?: string;
  campusId?: number;
  createdAt?: Date;
  permissions?: UserPermissionData[];
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}UserAccount/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query<ApiResponse<UserData[]>, void>({
      query: () => "GetAllUsers",
    }),
    fetchUserById: builder.query<ApiResponse<UserData>, number>({
      query: (id) => `GetUserById/${id}`,
    }),
    addUser: builder.mutation<ApiResponse<UserData>, UserData>({
      query: (userData) => ({
        url: "Register",
        method: "POST",
        body: userData,
      }),
    }),
    
    login: builder.mutation<ApiResponse<UserData>, UserData>({
      query: (userData) => ({
        url: "Login",
        method: "POST",
        body: userData,
      }),
    }),
    updateUser: builder.mutation<ApiResponse<void>, UserData>({
      query: (userData) => ({
        url: "UpdateUser",
        method: "PUT",
        body: userData,
      }),
    }),
    deleteUser: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteUser?userId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useLoginMutation,
} = userApi;

export default userApi;
