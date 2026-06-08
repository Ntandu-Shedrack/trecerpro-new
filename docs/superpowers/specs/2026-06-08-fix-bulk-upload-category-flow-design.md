# Fix Bulk Upload Category Flow Design

This specification details the changes to the Laravel backend and Next.js frontend to correct the bulk asset upload flow. It ensures that category identification is correctly specified and recorded, instead of defaulting or writing 'Uncategorized' for imported assets, and restores the PHPUnit test suite to full health after the transition to dynamic asset fields.

## Proposed Changes

### Backend (Laravel)

#### [MODIFY] [ImportAssetsRequest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/ImportAssetsRequest.php)
- Update validation rules to allow either:
  1. A file-based upload via `file` (CSV/TXT).
  2. A JSON-based payload via `assets` (array) along with a `category_id` parameter.

#### [MODIFY] [AssetController.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AssetController.php)
- Update the `import()` method to support:
  1. **JSON payloads**: Read `assets` array and create each asset directly under `category_id`.
  2. **CSV file uploads**: Resolve category by reading the `category` column. If the `category` column is empty, check if `category_id` is passed as a request parameter. If neither is present, reject the row/request with a validation error.
- Create assets with `barcode` and resolved `category_id`.

#### [MODIFY] [ProjectActivityObserver.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Observers/ProjectActivityObserver.php)
- Set `entity_name` to `$model->barcode` instead of `$model->name` when the model is an instance of `Asset`.

#### [MODIFY] [AssetFactory.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/database/factories/AssetFactory.php)
- Replace static `name` and `description` keys in model definition with `barcode` key.

#### [MODIFY] [AssetTest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/AssetTest.php)
- Update test cases (`test_user_can_create_asset`, `test_user_can_update_asset`, `test_user_can_import_assets_via_csv`, etc.) to use `barcode` instead of `name`/`description`.
- Update the mock CSV content in `test_user_can_import_assets_via_csv` to have a `barcode` column instead of `name` and `description`.

#### [MODIFY] [ActivityLoggingTest.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/ActivityLoggingTest.php)
- Update test cases (`test_creating_asset_creates_activity_log`, `test_updating_asset_records_diff`, `test_deleting_asset_records_deleted_activity`) to send `barcode` instead of `name` and assert correct `barcode` values in logged activities.

---

### Frontend (Next.js)

The Next.js frontend is already properly constructed to send `category_id` and `assets` as a JSON array payload via `bulkCreateAssets(projectId, selectedCategoryId, parsedData)`. No changes are strictly required on the frontend side because it already implements this flow correctly.

---

## Verification Plan

### Automated Tests
- Run backend tests: `php artisan test`
- Run frontend type check: `pnpm tsc --noEmit`

### Manual Verification
1. Log into the application, select a project, and open the Bulk Upload dialog.
2. Select a category (e.g. IT Equipment) and upload a sample CSV.
3. Verify that the frontend parses the CSV, validates columns against the chosen category, and lets you review it.
4. Click Upload. Ensure the backend successfully processes the JSON import and all assets are created under the selected category (not "Uncategorized").
