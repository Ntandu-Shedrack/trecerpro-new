"use client";

import CategoryGrid from "@/components/dashboard/categories/category-grid";
import { Category } from "@/components/dashboard/categories/category.types";
import EditCategoryPanel from "@/components/dashboard/categories/edit-category-panel";
import AddCategoryDialog from "@/components/dashboard/categories/add-category-dialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Laptops",
    description: "Company issued laptops",
    assetCount: 24,
    attributes: [
      { name: "Serial Number", type: "text" },
      { name: "Purchase Date", type: "date" },
    ],
  },
  {
    id: "2",
    name: "Vehicles",
    description: "Company transport",
    assetCount: 8,
    attributes: [
      { name: "Plate Number", type: "text" },
      { name: "Mileage", type: "number" },
    ],
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-wider">
              Asset Categories
            </h1>

            <p className="text-muted-foreground">
              Define and manage asset types and their custom attributes.
            </p>
          </div>

          <Button
            className="gap-2 text-white"
            onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Category
          </Button>
        </div>

        {/* Layout */}
        <div className="flex gap-6">
          {/* Categories */}
          <div className="flex-1">
            <CategoryGrid
              categories={mockCategories}
              onEdit={(cat) => setSelectedCategory(cat)}
            />
          </div>

          {/* Edit Panel */}
          {selectedCategory && (
            <EditCategoryPanel
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <AddCategoryDialog open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
