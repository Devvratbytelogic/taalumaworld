'use client';
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';
import { openModal } from '@/store/slices/allModalSlice';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@heroui/react';
import {
  getAboutUsRoutePath,
  getAdminRoutePath,
  getAuthorsRoutePath,
  getBooksRoutePath,
  getCategoriesRoutePath,
  getContactUsRoutePath,
  getDesignSystemRoutePath,
  getFAQRoutePath,
  getHomeRoutePath,
  getPrivacyPolicyRoutePath,
  getTermsOfServiceRoutePath,
} from '@/routes/routes';
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import ImageComponent from '@/components/ui/ImageComponent';

export default function PrimaryFooter() {
    const contentMode = useAppSelector(selectContentMode);
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const { data: globalSettings } = useGetGlobalSettingsQuery();
    const settings = globalSettings?.data;

    const brandName = settings?.marketplace_name || settings?.platformName || 'TaalumaWorld';
    const description = settings?.platformDescription || settings?.meta_description || '';
    const email = settings?.supportEmail || settings?.email || '';
    const phone = settings?.phone || '';
    const address = settings?.address || '';
    const copyRight = settings?.copy_right_text || '';
    const logo = settings?.logo as string | null | undefined;

    const socialLinks = [
        { href: settings?.facebook_link, icon: Facebook, label: 'Facebook' },
        { href: settings?.x_link, icon: Twitter, label: 'X / Twitter' },
        { href: settings?.instagram_link, icon: Instagram, label: 'Instagram' },
        { href: settings?.youtube_link, icon: Youtube, label: 'YouTube' },
        { href: settings?.linkdin_link, icon: Linkedin, label: 'LinkedIn' },
    ].filter((s) => !!s.href);

    return (
        <>
            <footer className="bg-gray-900 text-gray-300">
                {/* Main Footer */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* About Section */}
                        <div>
                            <div className="mb-4">
                                {logo ? (
                                    <div className="h-10 w-[160px]">
                                        <ImageComponent src={logo} alt={brandName} object_cover={false} />
                                    </div>
                                ) : (
                                    <h3 className="text-white font-bold text-lg">{brandName}</h3>
                                )}
                            </div>
                            {description && (
                                <p className="text-sm text-white mb-4">{description}</p>
                            )}
                            {socialLinks.length > 0 && (
                                <div className="flex gap-3 flex-wrap">
                                    {socialLinks.map(({ href, icon: Icon, label }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={getHomeRoutePath()} className="hover:text-primary transition-colors">
                                        Home
                                    </Link>
                                </li>
                                {contentMode === 'books' && (
                                    <>
                                        <li>
                                            <Link href={getBooksRoutePath()} className="hover:text-primary transition-colors">
                                                Browse Books
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={getCategoriesRoutePath()} className="hover:text-primary transition-colors">
                                                Categories
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={getAuthorsRoutePath()} className="hover:text-primary transition-colors">
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
                                    <Link href={getPrivacyPolicyRoutePath()} className="hover:text-primary transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href={getTermsOfServiceRoutePath()} className="hover:text-primary transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    {isAuthenticated && isAdmin ? (
                                        <Link href={getAdminRoutePath()} className="hover:text-primary transition-colors">
                                            Admin Panel
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => dispatch(openModal({ componentName: 'SignIn', data: { isAdmin: true } }))}
                                            className="hover:text-primary transition-colors"
                                        >
                                            Admin Panel
                                        </button>
                                    )}
                                </li>
                                <li>
                                    <Link href={getDesignSystemRoutePath()} className="hover:text-primary transition-colors">
                                        Design System
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Newsletter */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
                            <ul className="space-y-3 text-sm mb-4">
                                {email && (
                                    <li className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                        <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
                                    </li>
                                )}
                                {phone && (
                                    <li className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                        <a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a>
                                    </li>
                                )}
                                {address && (
                                    <li className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                        <span>{address}</span>
                                    </li>
                                )}
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
                                {copyRight ? (
                                    <p className="mb-1">{copyRight}</p>
                                ) : (
                                    <p className="mb-1">
                                        © All rights reserved by{' '}
                                        <span className="text-white">{brandName}</span>
                                    </p>
                                )}
                                <p className="text-xs text-gray-400">Designed and developed by Bytelogic Technologies</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link href={getPrivacyPolicyRoutePath()} className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link href={getTermsOfServiceRoutePath()} className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link href={getContactUsRoutePath()} className="hover:text-primary transition-colors">
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
