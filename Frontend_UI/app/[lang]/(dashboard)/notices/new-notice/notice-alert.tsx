import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const NoticeAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Important</AlertTitle>
      <AlertDescription>
        Please review your notice before sending. Once sent, it cannot be
        recalled.
      </AlertDescription>
    </Alert>
  );
};

export default NoticeAlert;
