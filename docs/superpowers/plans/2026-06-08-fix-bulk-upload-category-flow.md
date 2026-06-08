# Fix Bulk Upload Category Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the bulk upload flow to allow importing assets into a selected category (via JSON or CSV upload) instead of default 'Uncategorized' and repair the test suite for dynamic asset fields.

**Architecture:** Extend the Laravel backend import route to accept both JSON array payloads (sent by the Next.js frontend) and multipart CSV uploads. Resolve categories correctly using request parameters or CSV columns, update activity logs, and fix model factories and feature tests to use `barcode` instead of the deprecated `name`/`description` columns.

**Tech Stack:** Laravel, PHPUnit, Next.js, TypeScript

---

### Task 1: Update Request Validation for Import API

**Files:**
- Modify: `tracepro-laravel/app/Http/Requests/ImportAssetsRequest.php`

- [ ] **Step 1: Update the rules in `ImportAssetsRequest.php`**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Requests/ImportAssetsRequest.php` to accept either `file` or `assets` (JSON array).
  
  Code change:
  ```php
  <?php

  namespace App\Http\Requests;

  use Illuminate\Foundation\Http\FormRequest;

  class ImportAssetsRequest extends FormRequest
  {
      /**
       * Determine if the user is authorized to make this request.
       */
      public function authorize(): bool
      {
          return true;
      }

      /**
       * Get the validation rules that apply to the request.
       *
       * @return array<string, array<int, string>>
       */
      public function rules(): array
      {
          return [
              'file' => ['required_without:assets', 'file', 'mimes:csv,txt'],
              'assets' => ['required_without:file', 'array'],
              'assets.*.barcode' => ['required_with:assets', 'string'],
              'assets.*.values' => ['sometimes', 'array'],
              'category_id' => ['required_with:assets', 'nullable', 'string', 'exists:categories,id'],
          ];
      }
  }
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add app/Http/Requests/ImportAssetsRequest.php
  git commit -m "feat(backend): support json import validation in ImportAssetsRequest"
  ```
  *(Note: Run git commands inside `/Users/mbp/Desktop/Code/tracepro-laravel`)*

---

### Task 2: Implement JSON and CSV Import Logic in Controller

**Files:**
- Modify: `tracepro-laravel/app/Http/Controllers/AssetController.php`

- [ ] **Step 1: Update the `import` method in `AssetController.php`**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AssetController.php` to handle both JSON payloads and file uploads.
  
  Replace the existing `import` function with:
  ```php
      /**
       * Bulk import assets from a CSV file or JSON array.
       */
      public function import(ImportAssetsRequest $request, Project $project): JsonResponse
      {
          $this->authorize('create', [Asset::class, $project]);

          $importedAssets = [];
          $errors = [];

          if ($request->has('assets')) {
              $categoryId = $request->input('category_id');
              if (! $categoryId) {
                  return response()->json([
                      'message' => 'The import failed due to errors.',
                      'errors' => ['The category_id field is required when assets are provided.'],
                  ], 422);
              }

              $category = $project->categories()->find($categoryId);
              if (! $category) {
                  return response()->json([
                      'message' => 'The import failed due to errors.',
                      'errors' => ['The selected category was not found in this project.'],
                  ], 422);
              }

              DB::transaction(function () use ($request, $project, $category, &$importedAssets): void {
                  foreach ($request->input('assets') as $assetData) {
                      $asset = $project->assets()->create([
                          'barcode' => $assetData['barcode'],
                          'category_id' => $category->id,
                          'values' => $assetData['values'] ?? [],
                      ]);

                      $importedAssets[] = [
                          'id' => $asset->id,
                          'barcode' => $asset->barcode,
                          'category' => $category->name,
                      ];
                  }
              });
          } else {
              $file = $request->file('file');
              $filePath = $file->getRealPath();

              DB::transaction(function () use ($filePath, $project, $request, &$importedAssets, &$errors): void {
                  if (($handle = fopen($filePath, 'r')) !== false) {
                      $headers = fgetcsv($handle);
                      if ($headers === false) {
                          $errors[] = 'CSV file is empty or invalid.';
                          fclose($handle);

                          return;
                      }

                      // Normalize headers: lowercase, trimmed, special character stripped
                      $headers = array_map(function (string $h): string {
                          return strtolower(trim(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $h)));
                      }, $headers);

                      $rowNumber = 1;
                      while (($row = fgetcsv($handle)) !== false) {
                          $rowNumber++;
                          if (empty($row) || (count($row) === 1 && $row[0] === null)) {
                              continue;
                          }

                          $rowDict = array_combine($headers, array_pad($row, count($headers), ''));
                          $assetBarcode = trim($rowDict['barcode'] ?? '');

                          if ($assetBarcode === '') {
                              $errors[] = "Row {$rowNumber}: 'barcode' column is required and cannot be empty.";

                              continue;
                          }

                          $categoryName = trim($rowDict['category'] ?? '');
                          $category = null;

                          if ($categoryName === '') {
                              if ($request->has('category_id')) {
                                  $category = $project->categories()->find($request->input('category_id'));
                              } else {
                                  $errors[] = "Row {$rowNumber}: Category must be specified either as a column or via category_id parameter.";
                                  continue;
                              }
                          } else {
                              $category = $project->categories()->where('name', $categoryName)->first();
                              if (! $category) {
                                  $category = $project->categories()->create([
                                      'name' => $categoryName,
                                      'description' => 'Automatically created during bulk import.',
                                      'attributes' => [],
                                  ]);
                              }
                          }

                          $dynamicValues = [];
                          $newAttributes = $category->attributes ?? [];
                          $attributesUpdated = false;

                          foreach ($rowDict as $key => $val) {
                              if (in_array($key, ['barcode', 'category'])) {
                                  continue;
                              }
                              if ($key === '') {
                                  continue;
                              }
                              $dynamicValues[$key] = $val;

                              if (! in_array($key, $newAttributes)) {
                                  $newAttributes[] = $key;
                                  $attributesUpdated = true;
                              }
                          }

                          if ($attributesUpdated) {
                              $category->update(['attributes' => $newAttributes]);
                          }

                          $asset = $project->assets()->create([
                              'barcode' => $assetBarcode,
                              'category_id' => $category->id,
                              'values' => $dynamicValues,
                          ]);

                          $importedAssets[] = [
                              'id' => $asset->id,
                              'barcode' => $asset->barcode,
                              'category' => $category->name,
                          ];
                      }
                      fclose($handle);
                  } else {
                      $errors[] = 'Failed to open the uploaded file.';
                  }
              });
          }

          if (! empty($errors) && empty($importedAssets)) {
              return response()->json([
                  'message' => 'The import failed due to errors.',
                  'errors' => $errors,
              ], 422);
          }

          return response()->json([
              'message' => 'Assets imported successfully.',
              'imported_count' => count($importedAssets),
              'assets' => $importedAssets,
              'errors' => $errors,
          ], 201);
      }
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add app/Http/Controllers/AssetController.php
  git commit -m "feat(backend): support both json and csv import flows in AssetController"
  ```

---

### Task 3: Update Project Activity Observer for Assets

**Files:**
- Modify: `tracepro-laravel/app/Observers/ProjectActivityObserver.php`

- [ ] **Step 1: Update `logActivity` in `ProjectActivityObserver.php`**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/app/Observers/ProjectActivityObserver.php` to retrieve the asset's `barcode` as the entity name.
  
  Change lines 111-119:
  ```php
          Activity::create([
              'project_id' => $projectId,
              'user_id' => $userId,
              'entity_type' => $entityType,
              'entity_id' => (string) $model->id,
              'entity_name' => $model instanceof Asset ? $model->barcode : $model->name,
              'action' => $action,
              'changes' => $changes,
          ]);
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add app/Observers/ProjectActivityObserver.php
  git commit -m "fix(backend): log asset barcode as entity_name in ProjectActivityObserver"
  ```

---

### Task 4: Fix Asset Model Factory Definition

**Files:**
- Modify: `tracepro-laravel/database/factories/AssetFactory.php`

- [ ] **Step 1: Replace name/description with barcode in factory**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/database/factories/AssetFactory.php` to define defaults for `barcode` and remove `name`/`description`.
  
  Code change:
  ```php
  <?php

  namespace Database\Factories;

  use App\Models\Asset;
  use App\Models\Category;
  use App\Models\Project;
  use Illuminate\Database\Eloquent\Factories\Factory;

  /**
   * @extends Factory<Asset>
   */
  class AssetFactory extends Factory
  {
      /**
       * Define the model's default state.
       *
       * @return array<string, mixed>
       */
      public function definition(): array
      {
          return [
              'project_id' => Project::factory(),
              'category_id' => Category::factory(),
              'barcode' => 'BARCODE-' . fake()->unique()->numberBetween(100000, 999999),
              'values' => [
                  'serial_number' => fake()->uuid(),
                  'condition' => fake()->randomElement(['new', 'good', 'fair', 'poor']),
              ],
          ];
      }
  }
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add database/factories/AssetFactory.php
  git commit -m "fix(backend): update AssetFactory columns to align with barcode schema"
  ```

---

### Task 5: Align Asset Tests and Test JSON Upload

**Files:**
- Modify: `tracepro-laravel/tests/Feature/AssetTest.php`

- [ ] **Step 1: Update `AssetTest.php` code**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/AssetTest.php` to:
  1. Remove `name` / `description` from all API test payloads and replace with `barcode`.
  2. Update CSV headers in `test_user_can_import_assets_via_csv`.
  3. Add a new test verifying user can import assets via JSON.

  Let's replace the whole contents of `/Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/AssetTest.php` with:
  ```php
  <?php

  namespace Tests\Feature;

  use App\Enums\MemberRole;
  use App\Models\Asset;
  use App\Models\Category;
  use App\Models\Organization;
  use App\Models\Project;
  use App\Models\User;
  use Illuminate\Foundation\Testing\RefreshDatabase;
  use Illuminate\Http\UploadedFile;
  use Tests\TestCase;

  class AssetTest extends TestCase
  {
      use RefreshDatabase;

      private function createSetup(): array
      {
          $user = User::factory()->create();
          $organization = Organization::factory()->create();
          $organization->users()->attach($user->id, ['role' => MemberRole::Owner]);
          $user->switchOrganization($organization->id);
          $project = Project::factory()->create(['organization_id' => $organization->id]);
          $category = Category::factory()->create(['project_id' => $project->id]);

          return [$user, $organization, $project, $category];
      }

      public function test_user_can_list_assets_for_project(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          Asset::factory()->count(3)->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->getJson("/api/projects/{$project->id}/assets");

          $response->assertStatus(200)
              ->assertJsonCount(3, 'data');
      }

      public function test_user_can_create_asset(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $response = $this->actingAs($user, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets", [
                  'barcode' => 'BARCODE123',
                  'category_id' => $category->id,
                  'values' => ['serial' => 'ABC123'],
              ]);

          $response->assertStatus(201)
              ->assertJsonPath('data.barcode', 'BARCODE123');

          $this->assertDatabaseHas('assets', [
              'project_id' => $project->id,
              'barcode' => 'BARCODE123',
          ]);
      }

      public function test_user_can_update_asset(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $asset = Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->putJson("/api/projects/{$project->id}/assets/{$asset->id}", [
                  'barcode' => 'BARCODE-UPDATED',
                  'category_id' => $category->id,
              ]);

          $response->assertStatus(200)
              ->assertJsonPath('data.barcode', 'BARCODE-UPDATED');
      }

      public function test_user_can_delete_asset(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $asset = Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->deleteJson("/api/projects/{$project->id}/assets/{$asset->id}");

          $response->assertStatus(204);
      }

      public function test_user_cannot_access_assets_from_another_organization(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $otherProject = Project::factory()->create();

          $response = $this->actingAs($user, 'sanctum')
              ->getJson("/api/projects/{$otherProject->id}/assets");

          $response->assertStatus(403);
      }

      public function test_assets_can_be_filtered_by_category(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $category2 = Category::factory()->create(['project_id' => $project->id]);

          Asset::factory()->count(2)->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
          ]);
          Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category2->id,
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->getJson("/api/projects/{$project->id}/assets?category_id={$category->id}");

          $response->assertStatus(200)
              ->assertJsonCount(2, 'data');
      }

      public function test_assets_can_be_searched(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'BARCODE-XYZ-123',
          ]);
          Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'BARCODE-ABC-999',
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->getJson("/api/projects/{$project->id}/assets?search=XYZ");

          $response->assertStatus(200)
              ->assertJsonCount(1, 'data');
      }

      public function test_user_can_import_assets_via_csv(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $category->update(['name' => 'Electronics', 'attributes' => ['serial_no']]);

          $csvContent = "barcode,category,serial_no,location,warranty_years\n".
                        "BARCODE001,Electronics,SN12345,Office A,3\n".
                        "BARCODE002,Mobile Devices,SN99999,Office B,2\n";

          $file = UploadedFile::fake()->createWithContent('assets.csv', $csvContent);

          $response = $this->actingAs($user, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets/import", [
                  'file' => $file,
              ]);

          $response->assertStatus(201)
              ->assertJsonPath('imported_count', 2);

          $this->assertDatabaseHas('assets', [
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'BARCODE001',
          ]);

          $macbook = Asset::where('barcode', 'BARCODE001')->first();
          $this->assertEquals('SN12345', $macbook->values['serial_no']);
          $this->assertEquals('Office A', $macbook->values['location']);
          $this->assertEquals('3', $macbook->values['warranty_years']);

          $newCategory = Category::where('name', 'Mobile Devices')->where('project_id', $project->id)->first();
          $this->assertNotNull($newCategory);

          $this->assertDatabaseHas('assets', [
              'project_id' => $project->id,
              'category_id' => $newCategory->id,
              'barcode' => 'BARCODE002',
          ]);

          $this->assertContains('serial_no', $category->fresh()->attributes);
          $this->assertContains('serial_no', $newCategory->attributes);
      }

      public function test_user_can_import_assets_via_json(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $response = $this->actingAs($user, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets/import", [
                  'category_id' => $category->id,
                  'assets' => [
                      [
                          'barcode' => 'JSONBARCODE001',
                          'values' => ['brand' => 'Apple', 'model' => 'MacBook Air'],
                      ],
                      [
                          'barcode' => 'JSONBARCODE002',
                          'values' => ['brand' => 'Dell', 'model' => 'Latitude'],
                      ]
                  ]
              ]);

          $response->assertStatus(201)
              ->assertJsonPath('imported_count', 2);

          $this->assertDatabaseHas('assets', [
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'JSONBARCODE001',
          ]);

          $this->assertDatabaseHas('assets', [
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'JSONBARCODE002',
          ]);
      }

      public function test_user_cannot_import_assets_if_unauthorized(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $otherUser = User::factory()->create();

          $csvContent = "barcode,category\nBARCODE999,Electronics\n";
          $file = UploadedFile::fake()->createWithContent('assets.csv', $csvContent);

          $response = $this->actingAs($otherUser, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets/import", [
                  'file' => $file,
              ]);

          $response->assertStatus(403);
      }

      public function test_import_validates_required_file(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $response = $this->actingAs($user, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets/import", []);

          $response->assertStatus(422)
              ->assertJsonValidationErrors(['file']);
      }
  }
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add tests/Feature/AssetTest.php
  git commit -m "test(backend): update AssetTest to use barcode schema and test json imports"
  ```

---

### Task 6: Align Activity Logging Tests

**Files:**
- Modify: `tracepro-laravel/tests/Feature/ActivityLoggingTest.php`

- [ ] **Step 1: Update `ActivityLoggingTest.php` code**
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/ActivityLoggingTest.php` to use `barcode` for asset creation/updates and assert on correct activity properties.

  Replace lines 173-249 in `/Users/mbp/Desktop/Code/tracepro-laravel/tests/Feature/ActivityLoggingTest.php` with:
  ```php
      public function test_creating_asset_creates_activity_log(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();

          $response = $this->actingAs($user, 'sanctum')
              ->postJson("/api/projects/{$project->id}/assets", [
                  'barcode' => 'Office-Asset-Barcode',
                  'category_id' => $category->id,
                  'values' => ['brand' => 'Dell'],
              ]);

          $response->assertStatus(201);
          $assetId = $response->json('data.id');

          $this->assertDatabaseHas('activities', [
              'project_id' => $project->id,
              'user_id' => $user->id,
              'entity_type' => 'asset',
              'entity_id' => $assetId,
              'entity_name' => 'Office-Asset-Barcode',
              'action' => 'created',
          ]);
      }

      public function test_updating_asset_records_diff(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $asset = Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'HP-Asset-Barcode',
              'values' => ['brand' => 'HP'],
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->putJson("/api/projects/{$project->id}/assets/{$asset->id}", [
                  'barcode' => 'HP-Updated-Barcode',
                  'category_id' => $category->id,
                  'values' => ['brand' => 'HP M2'],
              ]);

          $response->assertStatus(200);

          $activity = Activity::where('project_id', $project->id)
              ->where('entity_type', 'asset')
              ->where('action', 'updated')
              ->first();

          $this->assertNotNull($activity);
          $this->assertEquals($asset->barcode, $activity->changes['before']['barcode']);
          $this->assertEquals('HP-Updated-Barcode', $activity->changes['after']['barcode']);
          $this->assertStringContainsString('HP M2', $activity->changes['after']['values']);
      }

      public function test_deleting_asset_records_deleted_activity(): void
      {
          [$user, $organization, $project, $category] = $this->createSetup();
          $asset = Asset::factory()->create([
              'project_id' => $project->id,
              'category_id' => $category->id,
              'barcode' => 'Delete-Me-Barcode',
          ]);

          $response = $this->actingAs($user, 'sanctum')
              ->deleteJson("/api/projects/{$project->id}/assets/{$asset->id}");

          $response->assertStatus(204);

          $this->assertDatabaseHas('activities', [
              'project_id' => $project->id,
              'user_id' => $user->id,
              'entity_type' => 'asset',
              'entity_id' => $asset->id,
              'entity_name' => $asset->barcode,
              'action' => 'deleted',
          ]);
      }
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add tests/Feature/ActivityLoggingTest.php
  git commit -m "test(backend): update ActivityLoggingTest to use barcode for assets"
  ```
