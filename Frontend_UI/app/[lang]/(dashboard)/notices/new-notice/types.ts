type DeliveryType = "sms" | "whatsapp" | "email";
type NoticeType = "general" | "event" | "reminder";
type RecipientType = "general" | "student" | "teacher" | "parents" | "custom";
type StudentNoticeType = "all" | "byClass";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "student" | "teacher" | "parent";
};

type NoticeFormFieldTypes = {
  title: string;
  content: string;
  noticeType: NoticeType;
  recipientType: RecipientType;
  studentNoticeType: StudentNoticeType;
  deliveryType: DeliveryType;
  selectedClasses: string[];
  selectedContacts: Contact[];
};

export type {
  DeliveryType,
  NoticeType,
  RecipientType,
  StudentNoticeType,
  Contact,
  NoticeFormFieldTypes,
};
