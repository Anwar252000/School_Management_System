import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, MessageSquare } from "lucide-react";

import { DeliveryType } from "./types";

type DeliveryMethodCardProps = {
  deliveryType: DeliveryType;
  setDeliveryType: (deliveryType: DeliveryType) => void;
};

const DeliveryMethodCard = (props: DeliveryMethodCardProps) => {
  const { deliveryType, setDeliveryType } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Method</CardTitle>
        <CardDescription>
          Choose how you want to deliver this notice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="email"
          value={deliveryType}
          onValueChange={(value) => setDeliveryType(value as DeliveryType)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Email Settings</Label>
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Will be sent to all registered email addresses
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sms" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>SMS Settings</Label>
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Will be sent to all registered phone numbers
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="whatsapp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>WhatsApp Settings</Label>
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Will be sent to all registered WhatsApp numbers
                  </span>
                </div>
              </div>
            </div>
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeliveryMethodCard;
