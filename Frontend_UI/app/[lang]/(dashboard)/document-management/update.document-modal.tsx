// components/document/UpdateDocumentModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentData } from "@/services/apis/documentService";
import UpdateDocumentForm from "./update-document";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData;
  refetch: () => void;
}

const UpdateDocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  document,
  refetch,
}) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="5xl">
        <DialogHeader>
          <DialogTitle>Update Document</DialogTitle>
        </DialogHeader>
        <UpdateDocumentForm
          document={document}
          refetch={refetch}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDocumentModal;
