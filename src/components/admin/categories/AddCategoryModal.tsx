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
import type { Category } from '../../../data/mockData';

const initialFormValues = {
  name: '',
  subcategories: [] as string[],
};

function getSubcategoryOptions(categories: Category[]): string[] {
  const set = new Set<string>();
  categories.forEach((c) => c.subcategories.forEach((s) => set.add(s.name)));
  return Array.from(set).sort();
}

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess?: () => void;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddCategoryModalProps) {
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(categories), [categories]);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: categorySchema,
    onSubmit: () => {
      resetForm({ values: initialFormValues });
      onOpenChange(false);
      toast.success('Category created successfully');
      onSuccess?.();
    },
  });

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
                        : values.subcategories.join(', ')}
                    </span>
                    <ChevronDownIcon className="opacity-50 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width)">
                  {subcategoryOptions.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground">
                      No subcategories defined yet. Add categories with subcategories first.
                    </div>
                  ) : (
                    subcategoryOptions.map((name) => (
                      <DropdownMenuCheckboxItem
                        key={name}
                        checked={values.subcategories.includes(name)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...values.subcategories, name]
                            : values.subcategories.filter((n) => n !== name);
                          setFieldValue('subcategories', next);
                          setFieldTouched('subcategories', true);
                        }}
                      >
                        {name}
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
