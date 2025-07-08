"use client";
// import NewNoticeForm from "./form";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import NoticeForm from "./notice-form";

const Page = () => {
  return (
    <>
      <div className="mb-5">
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem>Notices</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">New Notice</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <NoticeForm />
      {/* <NewNoticeForm /> */}
    </>
  );
};

export default Page;
