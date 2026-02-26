/**
 * Admin Pages Manager - Centralized Page Management
 * Manage ALL pages including Home Page from one place
 */

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, FileText, Globe, Save, X, Home, ArrowLeft, Sparkles, Layout, TrendingUp, BookOpen, Quote, User } from 'lucide-react';
import { Card } from '../ui/card';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
  author: string;
  type: 'static' | 'home';
}

interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
    showVideo: boolean;
  };
  features: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  stats: {
    enabled: boolean;
    items: Array<{
      label: string;
      value: string;
      icon: string;
    }>;
  };
  featuredContent: {
    enabled: boolean;
    title: string;
    subtitle: string;
  };
  testimonials: {
    enabled: boolean;
    title: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
    }>;
  };
  cta: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export function AdminPagesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingHomePage, setEditingHomePage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for regular pages
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as 'published' | 'draft',
  });

  // Home page content state
  const [homeContent, setHomeContent] = useState<HomePageContent>({
    hero: {
      title: 'Accelerate Your Career with Expert Knowledge',
      subtitle: 'For College Graduates & Young Professionals',
      description: 'Access curated insights from industry thought leaders. Learn at your own pace with focused areas or complete books.',
      ctaText: 'Explore Content',
      ctaLink: '/browse',
      backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
      showVideo: false,
    },
    features: {
      enabled: true,
      title: 'Why Taaluma.world?',
      subtitle: 'Everything you need to advance your professional journey',
      items: [
        {
          title: 'Expert Thought Leaders',
          description: 'Learn from industry professionals and career experts',
          icon: 'Users',
        },
        {
          title: 'Flexible Learning',
          description: 'Choose focus areas or complete books based on your needs',
          icon: 'BookOpen',
        },
        {
          title: 'Career-Focused',
          description: 'Content designed specifically for young professionals',
          icon: 'TrendingUp',
        },
      ],
    },
    stats: {
      enabled: true,
      items: [
        { label: 'Active Users', value: '2,847', icon: 'Users' },
        { label: 'Expert Thought Leaders', value: '42', icon: 'Users' },
        { label: 'Books Available', value: '156', icon: 'BookOpen' },
        { label: 'Satisfaction Rate', value: '98%', icon: 'TrendingUp' },
      ],
    },
    featuredContent: {
      enabled: true,
      title: 'Featured Learning Paths',
      subtitle: 'Hand-picked content to boost your career',
    },
    testimonials: {
      enabled: true,
      title: 'What Our Users Say',
      items: [
        {
          name: 'Sarah Johnson',
          role: 'Marketing Manager',
          content: 'Taaluma.world helped me land my dream job. The career-focused content is invaluable!',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        {
          name: 'Michael Chen',
          role: 'Software Engineer',
          content: 'The flexibility to learn from individual areas or full books is perfect for my busy schedule.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        },
        {
          name: 'Emily Rodriguez',
          role: 'Business Analyst',
          content: 'Expert insights from real thought leaders. This platform is a game-changer!',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        },
      ],
    },
    cta: {
      enabled: true,
      title: 'Ready to Advance Your Career?',
      description: 'Join thousands of young professionals learning from the best.',
      buttonText: 'Get Started Today',
      buttonLink: '/signup',
    },
  });

  // All pages including home page
  const [pages, setPages] = useState<Page[]>([
    {
      id: 0,
      title: 'Home Page',
      slug: '/',
      content: 'Dynamic home page with hero, features, stats, and more',
      status: 'published',
      lastModified: '2024-01-21',
      author: 'Admin User',
      type: 'home',
    },
    {
      id: 1,
      title: 'About Us',
      slug: 'about-us',
      content: 'Learn about Taaluma.world and our mission to empower young professionals...',
      status: 'published',
      lastModified: '2024-01-20',
      author: 'Admin User',
      type: 'static',
    },
    {
      id: 2,
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'Your privacy is important to us. This policy outlines...',
      status: 'published',
      lastModified: '2024-01-15',
      author: 'Admin User',
      type: 'static',
    },
    {
      id: 3,
      title: 'Terms of Service',
      slug: 'terms-of-service',
      content: 'By using Taaluma.world, you agree to the following terms...',
      status: 'published',
      lastModified: '2024-01-10',
      author: 'Admin User',
      type: 'static',
    },
    {
      id: 4,
      title: 'Careers',
      slug: 'careers',
      content: 'Join our team! We are looking for talented individuals...',
      status: 'draft',
      lastModified: '2024-01-21',
      author: 'Content Manager',
      type: 'static',
    },
    {
      id: 5,
      title: 'FAQ',
      slug: 'faq',
      content: 'Frequently asked questions about our platform...',
      status: 'published',
      lastModified: '2024-01-18',
      author: 'Support Agent',
      type: 'static',
    },
  ]);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      status: 'draft',
    });
  };

  const handleCreatePage = () => {
    const newPage: Page = {
      id: pages.length + 1,
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      content: formData.content,
      status: formData.status,
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Admin User',
      type: 'static',
    };

    setPages([...pages, newPage]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleSaveStaticPage = () => {
    if (!selectedPage) return;

    setPages(pages.map(page =>
      page.id === selectedPage.id
        ? {
          ...page,
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          status: formData.status,
          lastModified: new Date().toISOString().split('T')[0],
        }
        : page
    ));

    setSelectedPage(null);
    resetForm();
  };

  const handleSaveHomePage = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('taaluma_homepage_content', JSON.stringify(homeContent));

      // Update home page in pages list
      setPages(pages.map(page =>
        page.type === 'home'
          ? { ...page, lastModified: new Date().toISOString().split('T')[0] }
          : page
      ));

      setIsSaving(false);
      setEditingHomePage(false);
      alert('Home page saved successfully!');
    }, 1000);
  };

  const handleDeletePage = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    if (page?.type === 'home') {
      alert('Cannot delete the home page!');
      return;
    }

    if (confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId));
    }
  };

  const openEditPage = (page: Page) => {
    if (page.type === 'home') {
      setEditingHomePage(true);
    } else {
      setSelectedPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
      });
    }
  };

  const updateHeroField = (field: string, value: any) => {
    setHomeContent({
      ...homeContent,
      hero: { ...homeContent.hero, [field]: value },
    });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newItems = [...homeContent.features.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setHomeContent({
      ...homeContent,
      features: { ...homeContent.features, items: newItems },
    });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newItems = [...homeContent.stats.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setHomeContent({
      ...homeContent,
      stats: { ...homeContent.stats, items: newItems },
    });
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newItems = [...homeContent.testimonials.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setHomeContent({
      ...homeContent,
      testimonials: { ...homeContent.testimonials, items: newItems },
    });
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If editing home page, show home page editor
  if (editingHomePage) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onPress={() => setEditingHomePage(false)}
              className='global_btn rounded_full bg_transparent'
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Edit Home Page</h2>
              <p className="text-muted-foreground">Customize your home page sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="global_btn rounded_full bg_transparent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2" onClick={handleSaveHomePage} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Home Page Sections Editor */}
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Hero Section</h3>
                  <p className="text-sm text-muted-foreground">Main banner and call-to-action</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Main Title</Label>
                  <Input
                    value={homeContent.hero.title}
                    onChange={(e) => updateHeroField('title', e.target.value)}
                    placeholder="Enter main headline"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={homeContent.hero.subtitle}
                    onChange={(e) => updateHeroField('subtitle', e.target.value)}
                    placeholder="Enter subtitle"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={homeContent.hero.description}
                    onChange={(e) => updateHeroField('description', e.target.value)}
                    placeholder="Enter description text"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>CTA Button Text</Label>
                    <Input
                      value={homeContent.hero.ctaText}
                      onChange={(e) => updateHeroField('ctaText', e.target.value)}
                      placeholder="e.g., Get Started"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>CTA Button Link</Label>
                    <Input
                      value={homeContent.hero.ctaLink}
                      onChange={(e) => updateHeroField('ctaLink', e.target.value)}
                      placeholder="e.g., /browse"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Background Image URL</Label>
                  <Input
                    value={homeContent.hero.backgroundImage}
                    onChange={(e) => updateHeroField('backgroundImage', e.target.value)}
                    placeholder="Enter image URL"
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Show Video Background</p>
                    <p className="text-sm text-muted-foreground">Display video instead of image</p>
                  </div>
                  <Switch
                    checked={homeContent.hero.showVideo}
                    onCheckedChange={(checked) => updateHeroField('showVideo', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layout className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Features Section</h3>
                  <p className="text-sm text-muted-foreground">Highlight key platform features</p>
                </div>
                <Switch
                  checked={homeContent.features.enabled}
                  onCheckedChange={(checked) =>
                    setHomeContent({
                      ...homeContent,
                      features: { ...homeContent.features, enabled: checked },
                    })
                  }
                />
              </div>

              {homeContent.features.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={homeContent.features.title}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          features: { ...homeContent.features, title: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Section Subtitle</Label>
                    <Input
                      value={homeContent.features.subtitle}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          features: { ...homeContent.features, subtitle: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4 mt-6">
                    <Label>Feature Items</Label>
                    {homeContent.features.items.map((item, index) => (
                      <Card key={index} className="p-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">Feature {index + 1}</Badge>
                          </div>
                          <Input
                            placeholder="Feature title"
                            value={item.title}
                            onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="Feature description"
                            value={item.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            rows={2}
                          />
                          <Input
                            placeholder="Icon name (e.g., Users, BookOpen)"
                            value={item.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Stats Section */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Statistics Section</h3>
                  <p className="text-sm text-muted-foreground">Display platform metrics</p>
                </div>
                <Switch
                  checked={homeContent.stats.enabled}
                  onCheckedChange={(checked) =>
                    setHomeContent({
                      ...homeContent,
                      stats: { ...homeContent.stats, enabled: checked },
                    })
                  }
                />
              </div>

              {homeContent.stats.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homeContent.stats.items.map((item, index) => (
                      <Card key={index} className="p-4 bg-gray-50">
                        <div className="space-y-3">
                          <Badge variant="secondary">Stat {index + 1}</Badge>
                          <Input
                            placeholder="Label (e.g., Active Users)"
                            value={item.label}
                            onChange={(e) => updateStat(index, 'label', e.target.value)}
                          />
                          <Input
                            placeholder="Value (e.g., 2,847)"
                            value={item.value}
                            onChange={(e) => updateStat(index, 'value', e.target.value)}
                          />
                          <Input
                            placeholder="Icon name"
                            value={item.icon}
                            onChange={(e) => updateStat(index, 'icon', e.target.value)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Featured Content Section */}
          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Featured Content</h3>
                  <p className="text-sm text-muted-foreground">Showcase highlighted books or focus areas</p>
                </div>
                <Switch
                  checked={homeContent.featuredContent.enabled}
                  onCheckedChange={(checked) =>
                    setHomeContent({
                      ...homeContent,
                      featuredContent: { ...homeContent.featuredContent, enabled: checked },
                    })
                  }
                />
              </div>

              {homeContent.featuredContent.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={homeContent.featuredContent.title}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          featuredContent: { ...homeContent.featuredContent, title: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Section Subtitle</Label>
                    <Input
                      value={homeContent.featuredContent.subtitle}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          featuredContent: { ...homeContent.featuredContent, subtitle: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> The actual content displayed will be pulled from your latest/featured
                      books or focus areas based on your content mode settings.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Quote className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Testimonials</h3>
                  <p className="text-sm text-muted-foreground">User reviews and feedback</p>
                </div>
                <Switch
                  checked={homeContent.testimonials.enabled}
                  onCheckedChange={(checked) =>
                    setHomeContent({
                      ...homeContent,
                      testimonials: { ...homeContent.testimonials, enabled: checked },
                    })
                  }
                />
              </div>

              {homeContent.testimonials.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={homeContent.testimonials.title}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          testimonials: { ...homeContent.testimonials, title: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4 mt-6">
                    <Label>Testimonial Items</Label>
                    {homeContent.testimonials.items.map((item, index) => (
                      <Card key={index} className="p-4 bg-gray-50">
                        <div className="space-y-3">
                          <Badge variant="secondary">Testimonial {index + 1}</Badge>
                          <Input
                            placeholder="Name"
                            value={item.name}
                            onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="Role/Title"
                            value={item.role}
                            onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                          />
                          <Textarea
                            placeholder="Testimonial content"
                            value={item.content}
                            onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                            rows={3}
                          />
                          <Input
                            placeholder="Avatar URL"
                            value={item.avatar}
                            onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* CTA Section */}
          <TabsContent value="cta" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Call-to-Action Section</h3>
                  <p className="text-sm text-muted-foreground">Final conversion section</p>
                </div>
                <Switch
                  checked={homeContent.cta.enabled}
                  onCheckedChange={(checked) =>
                    setHomeContent({
                      ...homeContent,
                      cta: { ...homeContent.cta, enabled: checked },
                    })
                  }
                />
              </div>

              {homeContent.cta.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>CTA Title</Label>
                    <Input
                      value={homeContent.cta.title}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          cta: { ...homeContent.cta, title: e.target.value },
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>CTA Description</Label>
                    <Textarea
                      value={homeContent.cta.description}
                      onChange={(e) =>
                        setHomeContent({
                          ...homeContent,
                          cta: { ...homeContent.cta, description: e.target.value },
                        })
                      }
                      className="mt-2"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Button Text</Label>
                      <Input
                        value={homeContent.cta.buttonText}
                        onChange={(e) =>
                          setHomeContent({
                            ...homeContent,
                            cta: { ...homeContent.cta, buttonText: e.target.value },
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Button Link</Label>
                      <Input
                        value={homeContent.cta.buttonLink}
                        onChange={(e) =>
                          setHomeContent({
                            ...homeContent,
                            cta: { ...homeContent.cta, buttonLink: e.target.value },
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Main pages list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pages Manager</h2>
          <p className="text-muted-foreground">Manage all pages including home page from one place</p>
        </div>
        <Button
          className="global_btn rounded_full bg_primary"
          onPress={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          startContent={<Plus className="h-4 w-4" />}
        >
          Create Page
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pages</p>
              <p className="text-2xl font-bold">{pages.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">
                {pages.filter(p => p.status === 'published').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="text-2xl font-bold">
                {pages.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Home className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Home Page</p>
              <p className="text-sm font-bold">Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Pages Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {page.type === 'home' ? (
                      <Home className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{page.title}</span>
                    {page.type === 'home' && (
                      <Badge variant="default" className="ml-2">Featured</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {page.slug === '/' ? '/' : `/${page.slug}`}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={page.type === 'home' ? 'default' : 'secondary'}>
                    {page.type === 'home' ? 'Home Page' : 'Static'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {page.lastModified}
                </TableCell>
                <TableCell className="text-sm">{page.author}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="global_btn rounded_full bg_transparent">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditPage(page)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {page.type !== 'home' && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Page Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new static page to your platform
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 admin_panel">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="e.g., About Us"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="slug"
                  placeholder="about-us"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank to auto-generate from title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'published' | 'draft') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Page Content</Label>
              <Textarea
                id="content"
                placeholder="Write your page content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML or Markdown formatting
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="global_btn rounded_full outline_primary"
              onPress={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onPress={handleCreatePage} className="global_btn rounded_full bg_primary">
              <Save className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Static Page Modal */}
      <Dialog open={selectedPage !== null} onOpenChange={(open) => !open && setSelectedPage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Make changes to your page content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Page Title</Label>
              <Input
                id="edit-title"
                placeholder="e.g., About Us"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="edit-slug"
                  placeholder="about-us"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'published' | 'draft') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Page Content</Label>
              <Textarea
                id="edit-content"
                placeholder="Write your page content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML or Markdown formatting
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="global_btn rounded_full outline_primary"
              onPress={() => {
                setSelectedPage(null);
                resetForm();
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onPress={handleSaveStaticPage} className="global_btn rounded_full bg_primary">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
