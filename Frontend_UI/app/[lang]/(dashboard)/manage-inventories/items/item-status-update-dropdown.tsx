"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import { useUpdateItemDetailStatusMutation } from "@/services/apis/inventoryItemService";

interface ItemProps {
  itemDetailId: number;
  status: InventoryStatusData[];
}

const ItemStatusUpdateDropdown: React.FC<ItemProps> = ({
  itemDetailId,
  status,
}) => {
  const [loading, setLoading] = useState(false);
  const [itemStatusUpdate] = useUpdateItemDetailStatusMutation();

  const handleStatusUpdate = async (statusId: number) => {
    try {
      setLoading(true);
      const response = await itemStatusUpdate({ itemDetailId, statusId });
      toast.success(response?.data?.message);
    } catch (err: any) {
      toast.error("Failed to Update Status");
      console.error("Error updating Item status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            color="secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[196px] z-[9999]"
          align="end"
          side="bottom"
        >
          {status.map((item) => (
            <DropdownMenuItem
              key={item.statusId}
              onClick={() => handleStatusUpdate(item.statusId!)}
            >
              {item.statusName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {loading && <p>Loading...</p>}
    </>
  );
};

export default ItemStatusUpdateDropdown;
