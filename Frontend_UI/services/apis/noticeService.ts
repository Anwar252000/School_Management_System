import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import {
  DeliveryType,
  NoticeType,
  RecipientType,
} from "@/app/[lang]/(dashboard)/notices/new-notice/types";

type NoticeData = {
  noticeId?: number;
  title: string;
  content: string;
  noticeType: NoticeType;
  recipientType: RecipientType;
  deliveryType: DeliveryType;
  selectedClasses: string[];
  selectedContacts: any[];
  createdBy: number;
};

const noticeApi = createApi({
  reducerPath: "noticeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Notices/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchNotices: builder.query<ApiResponse<NoticeData[]>, void>({
      query: () => "Get",
    }),
    sendNotice: builder.mutation<ApiResponse<NoticeData>, NoticeData>({
      query: (noticeData) => ({
        url: "SendNotice",
        method: "POST",
        body: noticeData,
      }),
    }),
  }),
});

export const { useFetchNoticesQuery, useSendNoticeMutation } = noticeApi;

export default noticeApi;
