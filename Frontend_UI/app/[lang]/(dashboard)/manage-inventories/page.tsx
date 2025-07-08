"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";
import AddCategory from "./categories/add-category";
import {
  InventoryCategoryData,
  useFetchInventoryCategoriesQuery,
} from "@/services/apis/inventoryCategoryService";
import ReportsCard from "./reports";
import {
  InventoryItemData,
  useFetchInventoryItemsQuery,
} from "@/services/apis/inventoryItemService";
import AddItem from "./items/add-item";
import {
  InventoryStockData,
  useFetchInventoryStocksQuery,
} from "@/services/apis/inventoryStockService";
import {
  InventoryStatusData,
  useFetchInventoryStatusQuery,
} from "@/services/apis/inventoryStatusService";
import AddStock from "./stocks/add-stock";
import {
  InventoryPurchaseData,
  useFetchInventoryPurchasesQuery,
} from "@/services/apis/inventoryPurchaseService";
import AddPurchase from "./purchases/add-purchase";
import {
  AssetAllocationData,
  useFetchAllAllocatedAssetsQuery,
} from "@/services/apis/assetsAllocationService";
import AllocateAsset from "./assets-allocation/allocate-asset";
import AddStatus from "./statuses/add-status";

const page = () => {
  const { data: categoriesData, refetch: refetchCategories } =
    useFetchInventoryCategoriesQuery();
  const categories = categoriesData?.data as InventoryCategoryData[];
  const { data: itemsData, refetch: refetchItems } =
    useFetchInventoryItemsQuery();
  const items = itemsData?.data as InventoryItemData[];
  const { data: stocksData, refetch: refetchStocks } =
    useFetchInventoryStocksQuery();
  const stocks = stocksData?.data as InventoryStockData[];
  const { data: inventoryStatusData } = useFetchInventoryStatusQuery();
  const inventoryStatus = inventoryStatusData?.data as InventoryStatusData[];
  const { data: allocationsData, refetch: refetchAllocatedAssets } =
    useFetchAllAllocatedAssetsQuery();
  const allocatedAssets = allocationsData?.data as AssetAllocationData[];
  const { data: inventoryPurchaseData } = useFetchInventoryPurchasesQuery();
  const purchases = inventoryPurchaseData?.data as InventoryPurchaseData[];

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Inventories</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end space-x-4 m-2">
        <AddCategory />
        <AddItem categories={categories} refetchStocks={refetchStocks} />
        <AddStatus />
        <AddPurchase items={items} />
        <AllocateAsset
          items={items}
          status={inventoryStatus}
          refetchStocks={refetchStocks}
        />
        <AddStock items={items} status={inventoryStatus} />
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
          <ReportsCard
            categories={categories}
            items={items}
            stocks={stocks}
            status={inventoryStatus}
            allocatedAssets={allocatedAssets}
            purchases={purchases}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
