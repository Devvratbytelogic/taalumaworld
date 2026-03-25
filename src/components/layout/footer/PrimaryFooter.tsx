'use client';
import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';
import { openModal } from '@/store/slices/allModalSlice';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, LinkedinIcon, PinterestIcon, WhatsAppIcon } from '@/components/ui/AllSVG';
import { Input } from '@/components/ui/input';
import { Button } from '@heroui/react';
import { getAboutUsRoutePath, getAdminRoutePath, getContactUsRoutePath, getFAQRoutePath, getHomeRoutePath, getPrivacyPolicyRoutePath, getTermsOfServiceRoutePath } from '@/routes/routes';
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { useSubscribeToNewsletterMutation } from '@/store/rtkQueries/userPostAPI';
import ImageComponent from '@/components/ui/ImageComponent';
import toast from '@/utils/toast';

export default function PrimaryFooter() {
    const contentMode = useAppSelector(selectContentMode);
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribeToNewsletter, { isLoading: isSubscribing }] = useSubscribeToNewsletterMutation();
    
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
        { href: settings?.facebook_link, icon: FacebookIcon, label: 'Facebook' },
        { href: settings?.x_link, icon: TwitterIcon, label: 'X / Twitter' },
        { href: settings?.instagram_link, icon: InstagramIcon, label: 'Instagram' },
        { href: settings?.youtube_link, icon: YoutubeIcon, label: 'YouTube' },
        { href: settings?.linkdin_link, icon: LinkedinIcon, label: 'LinkedIn' },
        { href: settings?.pinterest_link, icon: PinterestIcon, label: 'Pinterest' },
        { href: settings?.whatsapp_link, icon: WhatsAppIcon, label: 'WhatsApp' },
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
                                {/* {contentMode === 'books' ? (
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
                                ) : (
                                    <li>
                                        <Link href={getAuthorsRoutePath()} className="hover:text-primary transition-colors">
                                            Thought Leaders
                                        </Link>
                                    </li>
                                )} */}
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
                            </ul>
                        </div>

                        {/* Legal & Account */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal & Support</h4>
                            <ul className="space-y-2 text-sm">
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
                                <li className="pt-2">
                                    {isAuthenticated && isAdmin ? (
                                        <Link
                                            href={getAdminRoutePath()}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Admin Panel
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => dispatch(openModal({ componentName: 'SignIn', data: { isAdmin: true } }))}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:border-primary/50 hover:text-primary transition-colors text-sm font-medium"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Admin Login
                                        </button>
                                    )}
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
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        className="bg-gray-800 h-auto border-gray-700 text-white placeholder:text-gray-500"
                                    />
                                    <Button
                                        className='global_btn rounded_full bg_primary'
                                        disabled={isSubscribing || !newsletterEmail}
                                        onPress={async () => {
                                            try {
                                                await subscribeToNewsletter({ email: newsletterEmail }).unwrap();
                                                toast.success('Subscribed successfully!');
                                                setNewsletterEmail('');
                                            } catch {
                                                toast.error('Failed to subscribe. Please try again.');
                                            }
                                        }}
                                    >
                                        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                                    </Button>
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
                                <p className="text-sm text-gray-400">Designed and developed by <Link href="https://bytelogicindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Bytelogic Technologies</Link></p>
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
