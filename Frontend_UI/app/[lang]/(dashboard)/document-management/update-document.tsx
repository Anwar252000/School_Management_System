"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  DocumentData,
  useUpdateDocumentMutation,
} from "@/services/apis/documentService";

interface UpdateDocumentFormProps {
  document: DocumentData;
  refetch: () => void;
  onCancel: () => void;
}

const UpdateDocumentForm: React.FC<UpdateDocumentFormProps> = ({
  document,
  refetch,
  onCancel,
}) => {
  const [title, setTitle] = useState(document.documentTitle);
  const [type, setType] = useState(document.documentType);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [updateDocument] = useUpdateDocumentMutation();

  useEffect(() => {
    setTitle(document.documentTitle);
    setType(document.documentType);
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) {
      toast.error("Title and Type are required");
      return;
    }

    const formData = new FormData();
    formData.append(
      "documentManagerId",
      (document.documentManagerId ?? 0).toString()
    );
    formData.append("documentTitle", title);
    formData.append("documentType", type);
    formData.append("updatedBy", loggedUser?.userId.toString() || "");

    if (file) {
      formData.append("formFile", file);
    }

    try {
      setLoading(true);
      const response = await updateDocument(formData).unwrap();
      if (response.data) {
        toast.success("Document updated successfully");
        refetch();
        onCancel(); // Close update form
      } else {
        toast.error("Failed to update document");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 mb-4">
      <h2 className="text-xl font-semibold mb-4">Update Document</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-6 items-end gap-5"
      >
        <div className="col-span-2">
          <Label htmlFor="title">Document Name*</Label>
          <Input
            id="title"
            placeholder="e.g., Document Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="type">Document Type*</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="file">Replace File (optional)</Label>
          <Input
            id="file"
            ref={fileInputRef}
            type="file"
            accept={
              type === "pdf"
                ? ".pdf"
                : type === "word"
                ? ".doc,.docx"
                : type === "excel"
                ? ".xls,.xlsx"
                : "*"
            }
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="col-span-1 flex gap-1">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Icon icon="eos-icons:bubble-loading" width={20} />
            ) : (
              <Icon icon="material-symbols:save" width={20} />
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <Icon icon="material-symbols:close-rounded" width={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDocumentForm;
