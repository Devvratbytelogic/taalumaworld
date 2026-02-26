import { Plus, FolderTree, Edit, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Category } from '../../../data/mockData';

interface CategoryListingProps {
  categories: Category[];
  searchQuery: string;
  onCreateCategory: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryListing({
  categories,
  searchQuery,
  onCreateCategory,
  onEdit,
  onDelete,
}: CategoryListingProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="rounded-3xl shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <FolderTree className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.subcategories.length} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    className="icon_btn text-primary"
                    onPress={() => onEdit(category)}
                    aria-label={`Edit ${category.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    className="icon_btn text-danger"
                    onPress={() => onDelete(category)}
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <Badge key={sub.id} variant="outline" className="mb-0">
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <FolderTree className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No categories found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first category to get started'}
              </p>
            </div>
            {!searchQuery && (
              <Button
                onPress={onCreateCategory}
                className="global_btn rounded_full bg_primary"
                startContent={<Plus className="h-4 w-4" />}
              >
                Create Your First Category
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
