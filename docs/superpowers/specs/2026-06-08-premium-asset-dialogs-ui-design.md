# Premium Asset Dialogs UI Design

This specification details the cosmetic and user experience (UX) enhancements to elevate the Asset Creation/Editing Dialog and the Bulk Upload Dialog to a professional, premium standard. The updates utilize advanced styling, clean layouts, custom status indicators, and smooth state animations.

## Proposed Changes

### Components

#### [MODIFY] [asset-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/asset-dialog.tsx)
1. **Interactive State Animations**:
   - Use `framer-motion` (`AnimatePresence` and `motion.div`) to animate the transition when a category is selected and the attributes spec grid slides open.
2. **Premium Category Information Card**:
   - When a category is active, render a card styled with a glassmorphism blur, subtle border glow, and visual counters showing the total number of category attributes.
3. **High-End Form Fields**:
   - Re-style all form inputs (standard inputs, select dropdown triggers, date pickers) with custom backgrounds, subtle drop shadows, and glowing border focus rings.
   - Design custom labels and clean required field markers.
   - Refactor boolean switch components to show animated "Enabled" (green glow) and "Disabled" (neutral) status states.

#### [MODIFY] [bulk-upload-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/bulk-upload-dialog.tsx)
1. **Visual Step Stepper**:
   - Add a stylized progress stepper at the top of the dialog with active state rings and connection bar animations.
2. **Interactive Drop Zone**:
   - Revamp the drag-and-drop file uploader area. Apply border morph animations (glowing primary border on dragOver), scale the upload icon, and show helper instruction animations.
3. **Data Verification Grid**:
   - Render the parsed CSV data preview inside a custom Table with hover highlights, sticky headers, and custom status badges.
   - Build a warning alert panel showing error details with clean highlight tags.

---

## Verification Plan

### Automated Tests
- Run `pnpm tsc --noEmit` to check for compilation issues.

### Manual Verification
1. Click "Add Asset" to verify the animated category selection screen.
2. Select a category. Ensure that the transition is smooth, and inputs display with the updated premium styling and glows.
3. Open the "Bulk Upload" dialog. Confirm the uploader drop zone scales and glows on file drag-over.
4. Upload a CSV with errors. Ensure the warning grid lists columns and rows cleanly with updated styles.
