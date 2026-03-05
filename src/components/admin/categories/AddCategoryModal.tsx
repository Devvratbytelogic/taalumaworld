import { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { Save, X, ChevronDownIcon } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import toast from '@/utils/toast';
import { categorySchema } from '@/utils/formValidation';
import { IAllCategoriesAPIResponseData } from '@/types/categories';

const initialFormValues = {
  name: '',
  subcategories: [] as string[],
};

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** All categories and nested subcategories with id + name, for the subcategories selector */
function getSubcategoryOptions(categories: IAllCategoriesAPIResponseData[]): { id: string; name: string }[] {
  const seen = new Set<string>();
  const options: { id: string; name: string }[] = [];
  categories.forEach((c) => {
    const id = c.id ?? c._id;
    if (id && !seen.has(id)) {
      seen.add(id);
      options.push({ id, name: c.name });
    }
    (c.subcategories ?? []).forEach((s) => {
      if (!s) return;
      const subId = s.id ?? s._id;
      if (subId && !seen.has(subId)) {
        seen.add(subId);
        options.push({ id: subId, name: s.name });
      }
    });
  });
  return options.sort((a, b) => a.name.localeCompare(b.name));
}

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: IAllCategoriesAPIResponseData[];
  onSubmit: (payload: any) => Promise<void>;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  categories,
  onSubmit,
}: AddCategoryModalProps) {
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(categories), [categories]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm, } = useFormik({
    initialValues: initialFormValues,
    validationSchema: categorySchema,
    onSubmit: async () => {
      const payload = {
        name: values.name.trim(),
        slug: slugFromName(values.name),
        subcategories: values.subcategories,
      };
      await onSubmit(payload);
      resetForm({ values: initialFormValues });
      onOpenChange(false);
    },
  });

  const selectedNames = useMemo(
    () =>
      values.subcategories
        .map((id) => subcategoryOptions.find((o) => o.id === id)?.name)
        .filter(Boolean) as string[],
    [values.subcategories, subcategoryOptions]
  );

  useEffect(() => {
    if (!open) {
      resetForm({ values: initialFormValues });
    }
  }, [open, resetForm]);

  const closeModal = () => {
    resetForm({ values: initialFormValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new category and optionally select subcategories.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 admin_panel">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category name<span className="text-red-500">*</span></Label>
              <Input
                id="category-name"
                name="name"
                placeholder="e.g., Fiction"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.name && touched.name ? 'border-red-500' : ''}
              />
              {errors.name && touched.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Subcategories</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="border-input flex h-9 w-full items-center justify-between gap-2 rounded-full border bg-input-background px-4 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4"
                  >
                    <span className={values.subcategories.length === 0 ? 'text-muted-foreground' : ''}>
                      {values.subcategories.length === 0
                        ? 'Select subcategories'
                        : selectedNames.join(', ')}
                    </span>
                    <ChevronDownIcon className="opacity-50 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width)">
                  {subcategoryOptions.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground">
                      No categories yet. Create categories first to link them here.
                    </div>
                  ) : (
                    subcategoryOptions.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt.id}
                        checked={values.subcategories.includes(opt.id)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...values.subcategories, opt.id]
                            : values.subcategories.filter((id) => id !== opt.id);
                          setFieldValue('subcategories', next);
                          setFieldTouched('subcategories', true);
                        }}
                      >
                        {opt.name}
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={closeModal}
              startContent={<X className="h-4 w-4" />}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary"
              startContent={<Save className="h-4 w-4" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
