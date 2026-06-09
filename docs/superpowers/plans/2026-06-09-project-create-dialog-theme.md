# Project Create Dialog Theme Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the styling and status validation schema of the project create dialog component with the application's CSS variable-based theme system and domain models.

**Architecture:** Modify the UI markup and styles of `ProjectCreateDialog` to replace all hardcoded Tailwind color names with responsive theme CSS variables (`bg-card`, `text-foreground`, `bg-primary`, etc.). Update the schema validator (`formSchema`) status enum to match the `ProjectStatus` type.

**Tech Stack:** React, Next.js, Radix UI (Dialog), Tailwind CSS v4, React Hook Form, Zod

---

### Task 1: Update Schema and Status Options

**Files:**
- Modify: `components/dashboard/project/project-create-dialog.tsx:40-46`
- Modify: `components/dashboard/project/project-create-dialog.tsx:180-194`

- [ ] **Step 1: Align Zod Schema Status Options**
  Modify lines 40-46 to replace the old status options (`draft`, `active`, `suspended`, `archived`) with the actual domain values (`active`, `on-hold`, `completed`).

  Target content:
  ```typescript
  const formSchema = z.object({
    name: z.string()
      .min(1, "Project name is required")
      .max(255, "Project name must not exceed 255 characters"),
    description: z.string().optional(),
    status: z.enum(["draft", "active", "suspended", "archived"]),
  });
  ```

  Replacement content:
  ```typescript
  const formSchema = z.object({
    name: z.string()
      .min(1, "Project name is required")
      .max(255, "Project name must not exceed 255 characters"),
    description: z.string().optional(),
    status: z.enum(["active", "on-hold", "completed"]),
  });
  ```

- [ ] **Step 2: Correct Select Option UI Styles**
  Update the select drop-down values and CSS classes in the JSX code to match the theme design and resolve the truncation issue.

  Target content:
  ```tsx
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-slate-900/60 border-slate-800 focus:bg-slate-950 focus:border-emerald-500/50 transition-all duration-200 capitalize">
                          <SelectValue placeholder="Select a project status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-950 border-slate-800 text-foreground">
                        <SelectItem value="active" className="cursor-pointer capitalize focus:bg-emerald-500/10 focus:text-emerald-400">Active</SelectItem>
                        <SelectItem value="on-hold" className="cursor-pointer capitalize focus:bg-amber-500/10 focus: c">On hold</SelectItem>
                        <SelectItem value="completed" className="cursor-pointer capitalize focus:bg-slate-500/10 focus:text-slate-400">Completed</SelectItem>
                      </SelectContent>
                    </Select>
  ```

  Replacement content:
  ```tsx
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/30 border-border/80 focus:bg-card focus:ring-2 focus:ring-primary/20 h-11 text-sm font-semibold text-foreground shadow-inner rounded-xl transition-all capitalize">
                          <SelectValue placeholder="Select a project status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-xl">
                        <SelectItem value="active" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-primary/10 focus:text-primary">Active</SelectItem>
                        <SelectItem value="on-hold" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-amber-500/10 focus:text-amber-500">On hold</SelectItem>
                        <SelectItem value="completed" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-muted focus:text-foreground">Completed</SelectItem>
                      </SelectContent>
                    </Select>
  ```

---

### Task 2: Align Dialog Layout and Styling Elements

**Files:**
- Modify: `components/dashboard/project/project-create-dialog.tsx:110-179`
- Modify: `components/dashboard/project/project-create-dialog.tsx:197-217`

- [ ] **Step 1: Align Dialog Header and Button Colors**
  Modify trigger button, DialogContent header wrapper, FolderPlus icon, DialogTitle, labels, and text input classes to match the theme.

  Target content:
  ```tsx
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 transition-all duration-200 hover:bg-slate-900 border-slate-800">
              <Plus className="h-4 w-4 text-emerald-500" />
              New Project
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-[500px] bg-slate-950 border border-slate-800/80 text-foreground p-0 overflow-hidden shadow-2xl rounded-xl">
          <DialogHeader className="p-6 pb-4 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border border-emerald-500/20">
                <FolderPlus className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <DialogTitle className="text-lg font-bold text-white tracking-tight">Create Project</DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Initialize a new project workspace. Define your asset monitoring scopes.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-slate-300 font-semibold tracking-wider text-[10px]">Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. Security Audit 2026"
                        className="bg-slate-900/60 border-slate-800 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-slate-300 font-semibold tracking-wider text-[10px]">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define the scope, objectives, or physical locations..."
                        className="resize-none h-24 bg-slate-900/60 border-slate-800 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-slate-300 font-semibold tracking-wider text-[10px]">Initial Status</FormLabel>
  ```

  Replacement content:
  ```tsx
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 transition-all duration-200 hover:bg-muted border-border text-foreground hover:text-foreground">
              <Plus className="h-4 w-4 text-primary" />
              New Project
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-[500px] border-border/60 bg-card text-foreground p-0 overflow-hidden shadow-2xl rounded-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <FolderPlus className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">Create Project</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-medium">
                  Initialize a new project workspace. Define your asset monitoring scopes.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6 pb-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. Security Audit 2026"
                        className="bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-medium text-sm text-foreground rounded-xl transition-all shadow-inner placeholder:text-muted-foreground/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define the scope, objectives, or physical locations..."
                        className="resize-none h-24 bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-medium text-sm text-foreground rounded-xl transition-all shadow-inner placeholder:text-muted-foreground/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Initial Status</FormLabel>
  ```

- [ ] **Step 2: Align Dialog Footer Colors and Padding**
  Update the cancel/submit buttons and footer styles.

  Target content:
  ```tsx
              <DialogFooter className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-2 bg-slate-950">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="hover:bg-slate-900 text-slate-400 hover:text-white transition-colors duration-200 mr-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white shadow-lg shadow-emerald-950/40 transition-all duration-200 min-w-[120px]"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
  ```

  Replacement content:
  ```tsx
              <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-4 bg-card p-6 rounded-b-2xl">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="px-6 mr-auto font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 h-11 font-black tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 border-none rounded-xl"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
  ```

---

### Task 3: Build Verification

- [ ] **Step 1: Run Next.js build verification**
  Run compilation to verify there are no TypeScript compile/build errors.

  Run: `pnpm build`
  Expected: Builds successfully.
