# Dynamic Asset Fields and Barcode Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the backend Asset model, requests, resource, and controller, and frontend dialogs/components to use `barcode` instead of `name`, remove `description`, and dynamically show all inputs based on the category attributes.

**Architecture:** 
1. Re-validate and map incoming API payloads in Laravel request rules.
2. Refactor `types/domain.ts`, server actions, dialog inputs, assets lists, and import sheets in Next.js to match the new `barcode` model.

**Tech Stack:** Laravel, React, Next.js, Zod, Tailwind CSS

---

### Task 1: Refactor Laravel Backend to use Barcode

**Files:**
- Modify: `app/Models/Asset.php`
- Modify: `app/Http/Requests/StoreAssetRequest.php`
- Modify: `app/Http/Requests/UpdateAssetRequest.php`
- Modify: `app/Http/Resources/AssetResource.php`
- Modify: `app/Http/Controllers/AssetController.php`

- [ ] **Step 1: Update Asset Model fillable fields**
  Modify [Asset.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Models/Asset.php) to change fillables:
  ```php
  #[Fillable(['project_id', 'category_id', 'barcode', 'values'])]
  ```

- [ ] **Step 2: Update Store/Update Request validators**
  In [StoreAssetRequest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/StoreAssetRequest.php):
  ```php
      public function rules(): array
      {
          return [
              'barcode' => ['required', 'string', 'max:255'],
              'category_id' => ['required', 'uuid', 'exists:categories,id'],
              'values' => ['nullable', 'array'],
          ];
      }
  ```
  In [UpdateAssetRequest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/UpdateAssetRequest.php):
  ```php
      public function rules(): array
      {
          return [
              'barcode' => ['sometimes', 'required', 'string', 'max:255'],
              'category_id' => ['sometimes', 'required', 'uuid', 'exists:categories,id'],
              'values' => ['nullable', 'array'],
          ];
      }
  ```

- [ ] **Step 3: Update AssetResource mapping**
  In [AssetResource.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Resources/AssetResource.php):
  ```php
      public function toArray(Request $request): array
      {
          return [
              'id' => $this->id,
              'project_id' => $this->project_id,
              'category_id' => $this->category_id,
              'barcode' => $this->barcode,
              'values' => $this->values,
              'category' => new CategoryResource($this->whenLoaded('category')),
              'created_at' => $this->created_at,
              'updated_at' => $this->updated_at,
          ];
      }
  ```

- [ ] **Step 4: Update AssetController query and CSV import logic**
  In [AssetController.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AssetController.php):
  - Change search filter to:
    ```php
                ->when($request->query('search'), function ($query, string $search): void {
                    $query->where('barcode', 'like', "%{$search}%");
                })
    ```
  - In `import()` method, update CSV header validation, dynamic extraction, and creation model parameters to use `barcode` instead of `name` and drop `description`.

---

### Task 2: Refactor Frontend Types & Server Actions

**Files:**
- Modify: `types/domain.ts`
- Modify: `actions/asset.actions.ts`

- [ ] **Step 1: Update Asset Types**
  In [domain.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/types/domain.ts), replace `name: string;` and `description: string | null;` on `Asset` and derived types with:
  ```typescript
  barcode: string;
  ```

- [ ] **Step 2: Update Server Actions**
  In [asset.actions.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/actions/asset.actions.ts), update `createAsset`, `updateAsset`, and `bulkCreateAssets` to handle `barcode` instead of `name` and `description` in parameter structures and payloads.

---

### Task 3: Refactor AssetDialog Component

**Files:**
- Modify: `components/dashboard/project/asset-dialog.tsx`

- [ ] **Step 1: Simplify Zod validation schema and form defaults**
  Change `buildDynamicSchema` and the react-hook-form initialization to work solely on category attributes.
  
  ```typescript
  function buildDynamicSchema(attributes: CategoryAttribute[]) {
    const shape: Record<string, z.ZodTypeAny> = {};
    attributes.forEach((attr) => {
      // ... same types definitions ...
      shape[attr.name] = fieldSchema;
    });

    return z.object({
      values: z.object(shape),
    });
  }
  ```

- [ ] **Step 2: Remove hardcoded inputs and condition field rendering**
  - Remove **Asset Identifier** and **Lifecycle Description** inputs.
  - Hide all components below the category selection dropdown when `categoryId` is empty.
  - In `onSubmit`, map `values.values.barcode` to the payload's `barcode` key.

---

### Task 4: Update Assets Listing and Bulk Upload

**Files:**
- Modify: `components/dashboard/project/assets-tab.tsx`
- Modify: `components/dashboard/project/bulk-upload-dialog.tsx`

- [ ] **Step 1: Update Assets List Tab**
  - In [assets-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/assets-tab.tsx), replace `{asset.name}` with `{asset.barcode}`.
  - Remove all description rendering/visual tags.

- [ ] **Step 2: Refactor Bulk Upload Component**
  - In [bulk-upload-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/bulk-upload-dialog.tsx), modify the sample CSV headers, parsing validators, preview table rows, and submit array mapping to use `barcode` instead of `name`/`description`.
