# Mandatory Barcode Category Attribute Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce that every asset category has a locked, mandatory barcode attribute.

**Architecture:** Update Zod schema validation to require the barcode attribute, default it during form initialization and edit reset, and disable UI controls for the barcode attribute row so it cannot be changed or deleted.

**Tech Stack:** Next.js, React, React Hook Form, Zod, Tailwind CSS, Lucide React

---

### Task 1: Update Category Dialog Schema and Logic

**Files:**
- Modify: [category-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx)

- [ ] **Step 1: Update the Zod Schema Validation**
  Add a refinement to `categorySchema` to verify that at least one attribute has the name/key `"barcode"`.

  Code modification in `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx` around line 68:
  ```typescript
  const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    attributes: z.array(attributeSchema).refine(
      (attrs) => attrs.some((attr) => attr.name === "barcode"),
      { message: "Barcode attribute is required" }
    ),
  });
  ```

- [ ] **Step 2: Update defaultValues in useForm**
  Ensure the barcode attribute is present in defaultValues when the form is initialized.

  Code modification in `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx` around line 105:
  ```typescript
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      attributes: [
        { label: "Barcode", name: "barcode", type: "string", required: true }
      ],
    },
  });
  ```

- [ ] **Step 3: Update Form Reset Behavior in useEffect**
  When editing a category, ensure the barcode attribute is prepended if not already present. When creating a new category, ensure the barcode attribute is default.

  Code modification in `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx` around line 119:
  ```typescript
  useEffect(() => {
    if (editingCategory) {
      const existingAttrs = editingCategory.attributes || [];
      const hasBarcode = existingAttrs.some(attr => attr.name === "barcode");
      const attributes = hasBarcode
        ? existingAttrs
        : [{ label: "Barcode", name: "barcode", type: "string", required: true }, ...existingAttrs];

      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
        attributes: attributes,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        attributes: [
          { label: "Barcode", name: "barcode", type: "string", required: true }
        ],
      });
    }
  }, [editingCategory, form]);
  ```

- [ ] **Step 4: Update handleLabelChange to ignore barcode**
  Ensure the label handler does not overwrite the key `name` for barcode.

  Code modification in `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx` around line 171:
  ```typescript
  const handleLabelChange = (index: number, labelVal: string) => {
    form.setValue(`attributes.${index}.label`, labelVal);
    const currentName = form.getValues(`attributes.${index}.name`);
    if (currentName === "barcode") return;
    if (!currentName || currentName === slugify(form.getValues(`attributes.${index}.label`) || "")) {
      form.setValue(`attributes.${index}.name`, slugify(labelVal));
    }
  };
  ```

- [ ] **Step 5: Lock UI fields for Barcode Attribute in rendering**
  Disable inputs when mapping over the `attributes` array if the attribute key is `"barcode"`.

  Code modification in `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx` around line 274:
  Identify:
  ```typescript
  const isBarcode = form.watch(`attributes.${index}.name`) === "barcode";
  ```

  And apply locks:
  1. Label input: `disabled={isBarcode}` and styling:
     ```typescript
     disabled={isBarcode}
     className={cn(
       "h-10 bg-muted/30 border-border/80 focus:bg-card text-foreground text-sm font-semibold",
       isBarcode && "bg-muted/20 cursor-not-allowed opacity-80"
     )}
     ```
  2. Key name input: `disabled={isBarcode}` and styling:
     ```typescript
     disabled={isBarcode}
     className={cn(
       "h-10 bg-muted/10 border-border/80 text-xs font-mono text-muted-foreground",
       isBarcode && "bg-muted/20 cursor-not-allowed opacity-80"
     )}
     ```
  3. Type SelectTrigger: `disabled={isBarcode}` and styling:
     ```typescript
     className={cn(
       "h-10 bg-muted/30 border-border/80 focus:ring-1 focus:ring-primary shadow-none text-foreground",
       isBarcode && "bg-muted/20 cursor-not-allowed opacity-80"
     )}
     ```
     And add `disabled={isBarcode}` to the `<Select>` component.
  4. Required Switch: `disabled={isBarcode}` to `<Switch>`.
  5. Delete Button: `disabled={isBarcode}` and styling:
     ```typescript
     className={cn(
       "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer",
       isBarcode && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
     )}
     disabled={isBarcode}
     ```

- [ ] **Step 6: Run build and lint verification**
  Run: `pnpm build`
  Expected: Successful compilation without TypeScript errors.

- [ ] **Step 7: Commit changes**
  Run: `git add components/dashboard/project/category-dialog.tsx`
  Run: `git commit -m "feat: enforce mandatory barcode attribute on asset categories"`
