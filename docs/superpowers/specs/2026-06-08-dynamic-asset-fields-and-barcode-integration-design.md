# Dynamic Asset Fields and Barcode Integration Design

This specification details the changes to the Asset Dialog and backend Asset model to replace the standard "Asset Name" (`name`) and "Description" (`description`) fields with fully dynamic fields determined by the category selected. The backend asset database and API will transition from `name` to `barcode`, and the description field will be completely removed.

## Proposed Changes

### Backend (Laravel)

#### [MODIFY] [Asset.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Models/Asset.php)
- Change fillable attributes from `['project_id', 'category_id', 'name', 'description', 'values']` to `['project_id', 'category_id', 'barcode', 'values']`.

#### [MODIFY] [StoreAssetRequest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/StoreAssetRequest.php)
- Replace `'name'` with `'barcode'` validator (required string, max 255).
- Remove `'description'` validation rule.

#### [MODIFY] [UpdateAssetRequest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/UpdateAssetRequest.php)
- Replace `'name'` with `'barcode'` validator (sometimes, required string, max 255).
- Remove `'description'` validation rule.

#### [MODIFY] [AssetResource.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Resources/AssetResource.php)
- Return `'barcode' => $this->barcode` instead of `'name' => $this->name`.
- Remove the `'description'` key.

#### [MODIFY] [AssetController.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AssetController.php)
- In `index()`, change search logic to match on `barcode` rather than `name` and `description`.
- In `import()`, read `barcode` column instead of `name`/`description`, and create assets with `barcode` instead of `name`.

---

### Frontend (Next.js)

#### [MODIFY] [domain.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/types/domain.ts)
- Replace `name` with `barcode` and remove `description` in the `Asset` and `AssetWithCategory` type definitions.

#### [MODIFY] [asset.actions.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/actions/asset.actions.ts)
- Update payload properties in `createAsset`, `updateAsset`, and `bulkCreateAssets` to pass `barcode` instead of `name` and `description`.

#### [MODIFY] [asset-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/asset-dialog.tsx)
- Rebuild Zod schema to exclude `name` and `description` root fields.
- Remove Asset Identifier (`name`) and Lifecycle Description (`description`) inputs from JSX.
- Render dynamic inputs only if a category classification is selected.
- Map `values.values.barcode` to the root `barcode` field during API form submission.

#### [MODIFY] [assets-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/assets-tab.tsx)
- Replace `{asset.name}` rendering and deletion text references with `{asset.barcode}`.
- Remove description rendering column/text elements.

#### [MODIFY] [bulk-upload-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/bulk-upload-dialog.tsx)
- Update sample download, CSV parser, and local validation schemas to use `barcode` instead of `name` and `description`.

---

## Verification Plan

### Automated Tests
- Run `pnpm tsc --noEmit` on the frontend.

### Manual Verification
1. Open the "Add Asset" dialog. Initially, only the **Asset Classification** (Category select) dropdown should be visible.
2. Select a category. Verify that the form dynamically reveals the category's attributes (including the mandatory **Barcode** input), and no static **Asset Identifier** or **Description** inputs are shown.
3. Fill in the values and create the asset. Verify that the asset is successfully created and displayed in the assets list tab with its barcode showing.
4. Try uploading a CSV via **Bulk Upload**. Confirm that the download template contains `barcode` as the first column instead of `name` and `description`, and import works as expected.
