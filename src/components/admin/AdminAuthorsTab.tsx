/**
 * Admin Authors (Thought Leaders) Tab
 * Manage authors and thought leaders
 */

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Book,
  Star
} from 'lucide-react';
import { Card } from '../ui/card';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function AdminAuthorsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const authors = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Leadership expert and executive coach',
      booksCount: 3,
      chaptersCount: 12,
      rating: 4.8,
      followers: 1247,
      status: 'active',
    },
    {
      id: 2,
      name: 'James Thompson',
      email: 'james.t@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      bio: 'Career development strategist',
      booksCount: 2,
      chaptersCount: 8,
      rating: 4.6,
      followers: 892,
      status: 'active',
    },
    {
      id: 3,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Communication and soft skills trainer',
      booksCount: 4,
      chaptersCount: 15,
      rating: 4.9,
      followers: 2103,
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Thought Leaders</h2>
          <p className="text-muted-foreground">Manage authors and content creators</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Thought Leader
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Authors</p>
              <p className="text-2xl font-bold">{authors.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Book className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published Books</p>
              <p className="text-2xl font-bold">{authors.reduce((sum, a) => sum + a.booksCount, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold">
                {(authors.reduce((sum, a) => sum + a.rating, 0) / authors.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Followers</p>
              <p className="text-2xl font-bold">
                {authors.reduce((sum, a) => sum + a.followers, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search thought leaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Authors Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thought Leader</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={author.avatar} />
                      <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-sm text-muted-foreground">{author.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{author.booksCount} books</p>
                    <p className="text-muted-foreground">{author.chaptersCount} chapters</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{author.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{author.followers.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button isIconOnly={true} className='icon_btn text-primary'>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
