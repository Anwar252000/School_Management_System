"use client";

import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import DocumentUploadForm from "./document-upload-form";
import DocumentListTable from "./document-table";
import { useGetAllFileQuery } from "@/services/apis/documentService";

const DocumentationPage = () => {
  const { data: documentData, refetch } = useGetAllFileQuery();
  const documents = (documentData?.data as []) || [];

  return (
    <React.Fragment>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">
            Documentation Management
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow">
        <DocumentUploadForm refetch={refetch} />
      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Uploaded Documents
        </h2>
        <DocumentListTable documents={documents} refetch={refetch} />
      </div>
    </React.Fragment>
  );
};

export default DocumentationPage;
