"use client";
import { Notice } from "./types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type EditNoticeProps = {
  noticeData: Notice;
  refetch: () => void;
};

const noticeDeliveryMethods = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "WhatsApp", value: "whatsapp" },
];

const noticeDeliveryStatus = [
  { label: "Pending", value: "pending" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
];

const EditNotice = (props: EditNoticeProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Notice</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <div>
          <div className="mt-6">
            <form>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Description"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <Select name="deliveryMethod">
                    <SelectTrigger id="deliveryMethod">
                      <SelectValue placeholder="Select Delivery Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {noticeDeliveryMethods.map((method, index) => (
                        <SelectItem key={index} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryStatus">Delivery Status</Label>
                  <Select name="deliveryStatus">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Delivery Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {noticeDeliveryStatus.map((method, index) => (
                        <SelectItem key={index} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postedBy">Posted By</Label>
                  <Input
                    type="text"
                    name="postedBy"
                    id="postedBy"
                    placeholder="Posted By"
                  />
                </div>
                <div>
                  <Label htmlFor="postedDate">Posted Date</Label>
                  <Input
                    type="date"
                    name="postedDate"
                    id="postedDate"
                    placeholder="Posted Date"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditNotice;
