import { Mail, MessageSquare, Send } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Contact,
  DeliveryType,
  RecipientType,
  StudentNoticeType,
} from "./types";

type PreviewCardProps = {
  title: string;
  content: string;
  recipientType: RecipientType;
  studentNoticeType: StudentNoticeType;
  selectedClasses: string[];
  selectedContacts: Contact[];
  deliveryType: DeliveryType;
  isPreviewOpen: boolean;
  setIsPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSending: boolean;
  isFormValid: () => boolean;
};

const PreviewCard = (props: PreviewCardProps) => {
  const {
    title,
    content,
    recipientType,
    studentNoticeType,
    deliveryType,
    isPreviewOpen,
    isSending,
    selectedClasses,
    selectedContacts,
    isFormValid,
    setIsPreviewOpen,
  } = props;

  const getRecipientLabel = () => {
    switch (recipientType) {
      case "general":
        return "All School Members";
      case "student":
        if (studentNoticeType === "all") {
          return "All Students";
        } else {
          return `${selectedClasses.length} Selected Class${
            selectedClasses.length !== 1 ? "es" : ""
          }`;
        }
      case "teacher":
        return "All Teachers";
      case "parents":
        return "All Parents";
      case "specific" as RecipientType:
        return `${selectedContacts.length} Selected Contact${
          selectedContacts.length !== 1 ? "s" : ""
        }`;
    }
  };

  const getDeliveryIcon = () => {
    switch (deliveryType) {
      case "sms":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "email":
        return <Mail className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notice Preview</CardTitle>
        <CardDescription>
          Preview how your notice will appear to recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title || "Notice Title"}</h3>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {content || "Notice content will appear here..."}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            {getDeliveryIcon()}
            <span>To: {getRecipientLabel()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog modal open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              Full Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notice Preview</DialogTitle>
              <DialogDescription>
                This is how your notice will appear to recipients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-md border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{title || "Notice Title"}</h3>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <p className="text-sm">
                  {content || "Notice content will appear here..."}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getDeliveryIcon()}
                  <span>To: {getRecipientLabel()}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="submit" disabled={!isFormValid()}>
          {isSending ? (
            <>Sending...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Notice
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewCard;
