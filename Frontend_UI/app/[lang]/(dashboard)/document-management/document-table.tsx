"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";

import {
  DocumentData,
  useDeleteDocumentMutation,
} from "@/services/apis/documentService";
import UpdateDocumentModal from "./update.document-modal";

interface Props {
  documents: DocumentData[];
  refetch: () => void;
}

const DocumentTable: React.FC<Props> = ({ documents, refetch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [selectedDocToEdit, setSelectedDocToEdit] =
    useState<DocumentData | null>(null);
  const itemsPerPage = 10;

  const [deleteDocument] = useDeleteDocumentMutation();

  const filteredDocuments = documents?.filter(
    (doc) =>
      doc.documentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id);
      toast.success("Document deleted successfully");
      setDocToDelete(null);
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by name or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded max-w-sm"
        />
      </div>

      {/* Document Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Last Modified By</TableHead>
            <TableHead>Last Modified Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((doc) => (
            <TableRow key={doc.documentManagerId} className="hover:bg-muted/50">
              <TableCell>{doc.documentTitle}</TableCell>
              <TableCell>{doc.createdUser}</TableCell>
              <TableCell>
                {doc.createdAt
                  ? new Date(doc.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : ""}
              </TableCell>
              <TableCell className="capitalize">{doc.documentType}</TableCell>
              <TableCell>{doc.updatedUser ?? doc.createdUser}</TableCell>
              <TableCell>
                {doc.updatedAt
                  ? new Date(doc.updatedAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : doc.createdAt
                  ? new Date(doc.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : ""}
              </TableCell>
              <TableCell className="flex justify-end gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const baseUrl =
                      process.env.NEXT_PUBLIC_BACKEND_URL_DOCUMENT ??
                      window.location.origin;
                    const fileUrl = `${baseUrl}${doc.filePath}`;
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = doc.fileName ?? "document";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="h-7 w-7"
                >
                  <Icon icon="heroicons:arrow-down-tray" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  color="success"
                  className="h-7 w-7"
                  onClick={() => setSelectedDocToEdit(doc)}
                >
                  <Icon icon="heroicons:pencil" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7"
                  onClick={() => setDocToDelete(doc.documentManagerId ?? 0)}
                >
                  <Icon icon="heroicons:trash" className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {docToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(docToDelete)}
          onCancel={() => setDocToDelete(null)}
        />
      )}
      {/* Update Document Modal */}
      {selectedDocToEdit && (
        <UpdateDocumentModal
          isOpen={!!selectedDocToEdit}
          document={selectedDocToEdit}
          onClose={() => setSelectedDocToEdit(null)}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default DocumentTable;
