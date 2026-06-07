# Mandatory Barcode Category Attribute Design

This specification details the design and implementation to enforce that every asset category must have a locked `barcode` attribute. This attribute will be automatically pre-populated, validated, and visually locked in the category creation/editing dialog.

## User Review Required

> [!IMPORTANT]
> The `barcode` attribute is enforced to ensure database consistency for asset tracking. It is configured with key `barcode`, type `string`, and marked as `required`. 
> 
> Once implemented, all newly created categories and edited legacy categories will automatically have this attribute added.

## Proposed Changes

### Dashboard Components

#### [MODIFY] [category-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx)

1. **Zod Validation**:
   - Update `categorySchema` to enforce that `attributes` has at least one attribute where `name` is `"barcode"`.

2. **Form Defaults**:
   - Pre-populate `attributes` with `[{ label: "Barcode", name: "barcode", type: "string", required: true }]` in default values.

3. **Form Reset Handling**:
   - In `useEffect` handling category edits, check if `editingCategory.attributes` contains the `"barcode"` attribute. If not (legacy category), prepend the default barcode attribute before resetting the form.

4. **UI Locking & Disabling**:
   - Identify the barcode row using `const isBarcode = form.watch("attributes." + index + ".name") === "barcode";`.
   - Disable inputs for:
     - Label (value: `"Barcode"`)
     - Key/Name (value: `"barcode"`)
     - Type Select
     - Required Switch
     - Delete Button (render disabled and style with lower opacity)

## Verification Plan

### Manual Verification
1. Open the "Add Category" dialog. Verify that the "Barcode" attribute is pre-populated at index 0.
2. Confirm that the label, key, type, and required fields for the "Barcode" attribute are disabled/readonly.
3. Confirm that the delete button for the "Barcode" attribute is disabled.
4. Try adding new attributes and saving the category. Ensure it saves successfully.
5. Edit an existing category that lacks the "Barcode" attribute. Verify that the "Barcode" attribute is automatically added and locked in the UI, and updating the category works.
