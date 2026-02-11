'use client';
import React from 'react'
import { useAppSelector } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';
import Link from 'next/link'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@heroui/react';
import { getAboutUsRoutePath, getContactUsRoutePath, getFAQRoutePath } from '@/routes/routes';

export default function PrimaryFooter() {
    const contentMode = useAppSelector(selectContentMode);
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="bg-gray-900 text-gray-300">
                {/* Main Footer */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* About Section */}
                        <div>
                            <div className="mb-4">
                                <h3 className="text-white font-bold text-lg">
                                    Taaluma<span className="text-primary">World</span>
                                </h3>
                            </div>
                            <p className="text-sm mb-4">
                                Empowering college graduates and young professionals with career-focused insights from thought leaders worldwide. Access curated knowledge to accelerate your professional journey.
                            </p>
                            <div className="flex gap-3">
                                <button className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </button>
                                <button className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </button>
                                <button className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </button>
                                <button className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                                    <Youtube className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/" className="hover:text-primary transition-colors">
                                        Home
                                    </Link>
                                </li>
                                {contentMode === 'books' && (
                                    <>
                                        <li>
                                            <Link href="/books" className="hover:text-primary transition-colors">
                                                Browse Books
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/categories" className="hover:text-primary transition-colors">
                                                Categories
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/authors" className="hover:text-primary transition-colors">
                                                Thought Leaders
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={getAboutUsRoutePath()} className="hover:text-primary transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href={getContactUsRoutePath()} className="hover:text-primary transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href={getFAQRoutePath()} className="hover:text-primary transition-colors">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-primary transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-primary transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin" className="hover:text-primary transition-colors">
                                        Admin Panel
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/design-system" className="hover:text-primary transition-colors">
                                        Design System
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Newsletter */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
                            <ul className="space-y-3 text-sm mb-4">
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                    <span>support@taaluma.world</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                    <span>123 Book Street, Reading City, RC 12345</span>
                                </li>
                            </ul>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-white">Subscribe to our newsletter</p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Your email"
                                        className="bg-gray-800 h-auto border-gray-700 text-white placeholder:text-gray-500"
                                    />
                                    <Button className='global_btn rounded_full bg_primary'>Subscribe</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                            <div className="text-center md:text-left">
                                <p className="mb-1">
                                    © All rights reserved by{' '}
                                    <span className="text-white">
                                        Taaluma<span className="text-primary">World</span>
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400">Designed and developed by Bytelogic Technologies</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link href="/terms" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
