import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface BackupData {
  backupId: number;
  backupName: string;
  backupDate: string;
}

export const backupApi = createApi({
  reducerPath: "backupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Backups/`, // Corrected to match controller route
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Backup"],

  endpoints: (builder) => ({
    // GET: Get all backups
    fetchBackups: builder.query<ApiResponse<BackupData[]>, void>({
      query: () => "GetBackups",
      providesTags: ["Backup"],
    }),

    // POST: Create a new backup
    createBackup: builder.mutation<ApiResponse<void>, string>({
      query: (backupName) => ({
        url: `CreateBackup?backupName=${backupName}`,
        method: "POST",
      }),
      invalidatesTags: ["Backup"],
    }),

    // POST: Restore from existing backup name
    restoreBackup: builder.mutation<ApiResponse<void>, string>({
      query: (backupName) => ({
        url: `RestoreBackup?backupName=${backupName}`,
        method: "POST",
      }),
    }),

    // POST: Restore from uploaded file
    restoreBackupFromFile: builder.mutation<ApiResponse<void>, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "RestoreBackupFromFile",
          method: "POST",
          body: formData,
        };
      },
    }),

    // DELETE: Delete backup by ID
    deleteBackup: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteBackup?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Backup"],
    }),

    // POST: Download backup file by name
    downloadBackup: builder.mutation<Blob, string>({
      query: (backupName) => ({
        url: `DownloadBackup?backupName=${backupName}`,
        method: "POST",
        responseHandler: async (response) => await response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchBackupsQuery,
  useCreateBackupMutation,
  useRestoreBackupMutation,
  useRestoreBackupFromFileMutation,
  useDeleteBackupMutation,
  useDownloadBackupMutation,
} = backupApi;

export default backupApi;
