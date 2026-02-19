import { useState } from 'react';
import { Plus, FolderTree, Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';

export function AdminCategoriesTab() {
  const { data: categories = [] } = useGetCategoriesQuery();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Categories Management
            </h1>
            <p className="text-muted-foreground">
              Organize content with categories and subcategories
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
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
                <div className="flex">
                  <Button isIconOnly={true} className='icon_btn text-primary'>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button isIconOnly={true} className='icon_btn text-danger'>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.subcategories.map((sub) => (
                  <Badge
                    key={sub.id}
                    variant="outline"
                    className="mr-2 mb-2"
                  >
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
