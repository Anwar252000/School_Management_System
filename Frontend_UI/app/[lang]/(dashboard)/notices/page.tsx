"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import NoticesTable from "./notices-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const Page = () => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Notices</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end space-x-4 m-2">
        {/* <NewNotice /> */}
        <Button asChild>
          <Link href="/notices/new-notice" className="btn btn-primary">
            <Icon icon="eva:plus-outline" className="w-4 h-4 mr-1" />
            New Notice
          </Link>
        </Button>
      </div>

      <NoticesTable />
    </div>
  );
};

export default Page;
