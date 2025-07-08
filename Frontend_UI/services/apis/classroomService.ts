import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ClassroomData {
  classroomId?: number; // Corresponds to ClassId in the entity
  campusId?: number;
  roomNumber: string; // Corresponds to ClassName in the entity
  building: string; // Corresponds to ClassDescription in the entity
  capacity: number; // Corresponds to Capacity in the entity
  createdAt?: Date; // Corresponds to CreatedAt in the entity
  createdBy?: number; // Corresponds to CreatedBy in the entity
  updatedBy?: number; // Corresponds to UpdatedBy in the entity
  updatedAt?: Date; // Corresponds to UpdatedAt in the entity
  isActive?: boolean; // Indicates if the classroom is active
}

export const classroomApi = createApi({
  reducerPath: "classroomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Classroom/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchClassrooms: builder.query<ApiResponse<ClassroomData[]>, void>({
      query: () => "GetClassroom",
    }),
    fetchClassroomById: builder.query<ApiResponse<ClassroomData>, number>({
      query: (id) => `GetClassroomById/${id}`,
    }),
    addClassroom: builder.mutation<ApiResponse<ClassroomData>, ClassroomData>({
      query: (classroomData) => ({
        url: "AddClassroom",
        method: "POST",
        body: classroomData,
      }),
    }),
    updateClassroom: builder.mutation<ApiResponse<void>, ClassroomData>({
      query: (classroomData) => ({
        url: "UpdateClassroom",
        method: "PUT",
        body: classroomData,
      }),
    }),
    deleteClassroom: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteClassroom?classroomId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchClassroomsQuery,
  useFetchClassroomByIdQuery,
  useAddClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} = classroomApi;

export default classroomApi;
