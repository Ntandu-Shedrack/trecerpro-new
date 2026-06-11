# Laravel Notifications Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Laravel API backend for Notifications to replace client-side mock-data and enable real organization-scoped notification events.

**Architecture:** Create a `Notification` model, a database migration for the `notifications` table, a JSON resource, a controller for listing, marking as read, and deleting notifications, and register the authenticated API endpoints.

**Tech Stack:** PHP 8.2+, Laravel 11, PostgreSQL, Sanctum Auth.

---

### Task 1: Create Database Migration

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/database/migrations/2026_06_11_200000_create_notifications_table.php`

- [ ] **Step 1: Write the migration file schema for the notifications table**

Create [2026_06_11_200000_create_notifications_table.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/database/migrations/2026_06_11_200000_create_notifications_table.php):
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('type'); // system, security, organization, asset
            $table->string('priority')->default('info'); // info, warning, critical
            $table->boolean('read')->default(false);
            $table->string('link')->nullable();
            $table->jsonb('changes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'organization_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
```

- [ ] **Step 2: Commit Task 1**

Run:
```bash
git add database/migrations/2026_06_11_200000_create_notifications_table.php
git commit -m "feat: add migration for notifications table"
```
*(Run this command in the laravel project directory)*

---

### Task 2: Create Eloquent Model

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Models/Notification.php`

- [ ] **Step 1: Write Eloquent Model with UUID traits and relationships**

Create [Notification.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Models/Notification.php):
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'organization_id',
        'title',
        'description',
        'type',
        'priority',
        'read',
        'link',
        'changes',
    ];

    protected $casts = [
        'read' => 'boolean',
        'changes' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
```

- [ ] **Step 2: Commit Task 2**

Run:
```bash
git add app/Models/Notification.php
git commit -m "feat: add Eloquent Notification model with UUID casing"
```

---

### Task 3: Create Notification API Resource

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Resources/NotificationResource.php`

- [ ] **Step 1: Write API Resource for JSON structure formatting**

Create [NotificationResource.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Resources/NotificationResource.php):
```php
<?php

namespace App\Http\Resources;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Notification
 */
class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'priority' => $this->priority,
            'read' => $this->read,
            'created_at' => $this->created_at->toIso8601String(),
            'link' => $this->link,
            'changes' => $this->changes,
        ];
    }
}
```

- [ ] **Step 2: Commit Task 3**

Run:
```bash
git add app/Http/Resources/NotificationResource.php
git commit -m "feat: add NotificationResource for clean JSON formatting"
```

---

### Task 4: Create Notification Controller

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/NotificationController.php`

- [ ] **Step 1: Write controller actions to list, mark read, and delete notifications**

Create [NotificationController.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/NotificationController.php):
```php
<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * List all notifications for user under active organization context.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $org = $user->activeOrganization;

        if (!$org) {
            return response()->json([
                'message' => 'No active organization selected.'
            ], 403);
        }

        $notifications = Notification::where('user_id', $user->id)
            ->where('organization_id', $org->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => NotificationResource::collection($notifications)
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json([
            'message' => 'Notification marked as read successfully.'
        ]);
    }

    /**
     * Mark all user notifications in selected organization as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();
        $org = $user->activeOrganization;

        if (!$org) {
            return response()->json([
                'message' => 'No active organization selected.'
            ], 403);
        }

        Notification::where('user_id', $user->id)
            ->where('organization_id', $org->id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read.'
        ]);
    }

    /**
     * Delete/Archive a notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully.'
        ]);
    }
}
```

- [ ] **Step 2: Commit Task 4**

Run:
```bash
git add app/Http/Controllers/NotificationController.php
git commit -m "feat: add NotificationController with index, read, and delete endpoints"
```

---

### Task 5: Create Seeder and Seed Data

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/database/seeders/NotificationSeeder.php`
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Write Seeder representing similar mock records**

Create [NotificationSeeder.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/database/seeders/NotificationSeeder.php):
```php
<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $org = Organization::first();

        if (!$user || !$org) {
            return;
        }

        $now = now();

        $items = [
            [
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'organization_id' => $org->id,
                'title' => 'Critical Security Alert',
                'description' => 'An unidentified mobile client attempted a restricted barcode scan from IP 192.168.1.105.',
                'type' => 'security',
                'priority' => 'critical',
                'read' => false,
                'link' => null,
                'changes' => null,
                'created_at' => $now->copy()->subMinutes(15),
                'updated_at' => $now->copy()->subMinutes(15),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'organization_id' => $org->id,
                'title' => 'New Batch Upload Completed',
                'description' => '240 new devices successfully uploaded and verified in the NYC-01 Server Cluster.',
                'type' => 'system',
                'priority' => 'info',
                'read' => false,
                'link' => '/dashboard/operations',
                'changes' => null,
                'created_at' => $now->copy()->subHours(3),
                'updated_at' => $now->copy()->subHours(3),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'organization_id' => $org->id,
                'title' => 'Project Audit Warning',
                'description' => 'EMEA Quarterly Audit has 12 items flagged as \'missing\' or \'needs verification\'.',
                'type' => 'asset',
                'priority' => 'warning',
                'read' => false,
                'link' => null,
                'changes' => null,
                'created_at' => $now->copy()->subHours(5),
                'updated_at' => $now->copy()->subHours(5),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'organization_id' => $org->id,
                'title' => 'Organization Invitation Accepted',
                'description' => 'Sarah Jenkins (s.jenkins@tracerpro.com) has joined the organization as a Manager.',
                'type' => 'organization',
                'priority' => 'info',
                'read' => true,
                'link' => null,
                'changes' => null,
                'created_at' => $now->copy()->subDay(),
                'updated_at' => $now->copy()->subDay(),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'organization_id' => $org->id,
                'title' => 'Asset Status Updated',
                'description' => 'MacBook Pro M2 (TRC-8902) was changed from \'active\' to \'maintenance\'.',
                'type' => 'asset',
                'priority' => 'info',
                'read' => true,
                'link' => null,
                'changes' => [
                    'before' => ['status' => 'active', 'location' => 'HQ - Floor 3'],
                    'after' => ['status' => 'maintenance', 'location' => 'IT Lab'],
                ],
                'created_at' => $now->copy()->subHours(30),
                'updated_at' => $now->copy()->subHours(30),
            ],
        ];

        foreach ($items as $item) {
            Notification::create($item);
        }
    }
}
```

- [ ] **Step 2: Update DatabaseSeeder to include NotificationSeeder**

Modify [DatabaseSeeder.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/database/seeders/DatabaseSeeder.php):
```php
<<<<
        $this->call([
            OrganizationSeeder::class,
            ProjectSeeder::class,
            AssetSeeder::class,
            ActivitySeeder::class,
        ]);
====
        $this->call([
            OrganizationSeeder::class,
            ProjectSeeder::class,
            AssetSeeder::class,
            ActivitySeeder::class,
            NotificationSeeder::class,
        ]);
>>>>
```

- [ ] **Step 3: Commit Task 5**

Run:
```bash
git add database/seeders/NotificationSeeder.php database/seeders/DatabaseSeeder.php
git commit -m "feat: add NotificationSeeder and register in main seeder workflow"
```

---

### Task 6: Register API Routes

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php`

- [ ] **Step 1: Wire up the endpoint routes under Sanctum & organization middleware protection**

Modify [api.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php) by registering endpoints under `org.selected` middleware:
```php
<<<<
    /**
     * Tenant-scoped routes (require an active organization)
     */
    Route::middleware('org.selected')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Project CRUD
        Route::apiResource('projects', ProjectController::class);
====
    /**
     * Tenant-scoped routes (require an active organization)
     */
    Route::middleware('org.selected')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Notifications API
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy']);

        // Project CRUD
        Route::apiResource('projects', ProjectController::class);
>>>>
```

- [ ] **Step 2: Commit Task 6**

Run:
```bash
git add routes/api.php
git commit -m "feat: register endpoints in api routes file under org context middleware"
```

---

### Task 7: Database Migration Execution & API Verification

**Files:**
- None

- [ ] **Step 1: Execute migrations and seeding**

Run:
```bash
php artisan migrate:fresh --seed
```
Expected: Successfully freshens tables and seeds new notifications.

- [ ] **Step 2: Commit Task 7**

Run:
```bash
git commit --allow-empty -m "chore: execute and verify notification backend seeding"
```
