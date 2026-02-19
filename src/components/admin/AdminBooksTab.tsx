import { useState } from 'react';
import { Plus, Book, MoreVertical, Eye, Edit, Trash2, Upload, Search } from 'lucide-react';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useGetAllBooksQuery } from '../../store/api/booksApi';
import { useGetAuthorsQuery } from '../../store/api/authorsApi';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import { useGetAllChaptersQuery } from '../../store/api/chaptersApi';

export function AdminBooksTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadingPPT, setIsUploadingPPT] = useState(false);

  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: chapters = [] } = useGetAllChaptersQuery();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePowerPointUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.ms-powerpoint' || 
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        setIsUploadingPPT(true);
        // Simulate upload process
        setTimeout(() => {
          setIsUploadingPPT(false);
          alert(`PowerPoint "${file.name}" uploaded successfully! This would be processed on the server.`);
        }, 2000);
      } else {
        alert('Please upload a valid PowerPoint file (.ppt or .pptx)');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Books Management
            </h1>
            <p className="text-muted-foreground">
              Manage all books on the platform
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Book
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books by title, thought leader, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={handlePowerPointUpload}
              className="hidden"
              id="ppt-upload"
            />
            <label htmlFor="ppt-upload">
              <Button 
                className="global_btn rounded_full outline_primary"
                disabled={isUploadingPPT}
                startContent={<Upload className="h-4 w-4" />}
              >
                {isUploadingPPT ? 'Uploading...' : 'Upload PowerPoint'}
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const author = authors.find((a) => a.id === book.authorId);
          const category = categories.find((c) => c.id === book.categoryId);
          const subcategory = category?.subcategories.find(
            (s) => s.id === book.subcategoryId
          );
          const bookChapters = chapters.filter((ch) => ch.bookId === book.id);

          return (
            <Card key={book.id} className="overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all">
              <div className="aspect-3/4 overflow-hidden bg-muted relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                       className="global_btn rounded_full bg_primary fit_btn"
                       isIconOnly={true}
                      //  size="sm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Book
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Book
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardHeader className="pb-3">
                <h3 className="line-clamp-1 font-bold">{book.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  by {author?.name || 'Unknown Thought Leader'}
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <Badge variant="outline" className="text-xs">
                    {category?.name}
                  </Badge>
                  {subcategory && (
                    <Badge variant="outline" className="text-xs">
                      {subcategory.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-3 space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {book.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Chapters:</span>
                    <span className="ml-1 font-medium">{bookChapters.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-1 font-medium capitalize">
                      {book.pricingType}
                    </span>
                  </div>
                </div>

                {book.pricingType === 'book' && book.bookPrice && (
                  <div className="pt-2">
                    <span className="text-lg font-bold text-primary">
                      ${book.bookPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      full book
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className="global_btn rounded_full outline_primary"
                >
                  Manage Chapters
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No books found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'Create your first book to get started'}
              </p>
            </div>
            {!searchQuery && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Book
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}