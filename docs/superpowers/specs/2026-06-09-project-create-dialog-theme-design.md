# Design Specification: Project Create Dialog Theme Setup Alignment

Align the styling and validation logic of the `ProjectCreateDialog` component with TracerPro's global theme system and standard domain types.

## Goals
- Harmonize the dialog visual components with theme CSS variables (`bg-card`, `border-border`, `text-foreground`, `bg-primary`, etc.) to support both Light and Dark modes.
- Resolve the Zod validation schema status enum mismatch against the actual domain status type.
- Rectify truncated utility classes in the status select option.

## Architectural Changes & UI Design

### 1. Schema Refactoring
The form validation schema will be updated to align with the domain statuses:
- **Before**: `status: z.enum(["draft", "active", "suspended", "archived"])`
- **After**: `status: z.enum(["active", "on-hold", "completed"])`

### 2. Styling Modifications
We will transform classes to utilize app theme CSS variables:
- **Main Container**: `bg-slate-950 border border-slate-800/80` -> `bg-card border border-border/60 rounded-2xl`
- **Header**: `bg-gradient-to-b from-slate-900/50 to-transparent border-b border-slate-800/60` -> `bg-gradient-to-b from-primary/5 to-transparent border-b border-border/60`
- **Header Icon**: `p-2 rounded-lg border border-emerald-500/20` -> `p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary`
- **Inputs & Textarea**: `bg-slate-900/60 border-slate-800 focus:bg-slate-950 focus:border-emerald-500/50` -> `bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20`
- **Select Trigger**: `bg-slate-900/60 border-slate-800 focus:bg-slate-950 focus:border-emerald-500/50` -> `bg-muted/30 border-border/80 focus:bg-card focus:ring-2 focus:ring-primary/20`
- **Select Content**: `bg-slate-950 border-slate-800` -> `bg-card border-border`
- **Dropdown Items**:
  - Active: `focus:bg-emerald-500/10 focus:text-emerald-400` -> `focus:bg-primary/10 focus:text-primary`
  - On hold: `focus:bg-amber-500/10 focus: c` -> `focus:bg-amber-500/10 focus:text-amber-500` (fixing the typo/truncation)
  - Completed: `focus:bg-slate-500/10 focus:text-slate-400` -> `focus:bg-muted focus:text-foreground`
- **Footer**: `bg-slate-950` -> `bg-card`
- **Submit Button**: `shadow-emerald-950/40` -> `shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/95`

## Verification
- Verify that compiling the project succeeds.
- Manually trigger the New Project dialog to verify visual alignment in both Light and Dark modes.
- Verify status changes submit successfully without validation errors.
