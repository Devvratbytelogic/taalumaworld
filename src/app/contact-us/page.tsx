'use client'
import React from 'react'
import ContactUsPageForm from '@/components/forms/ContactUsPageForm'
import { Clock, HelpCircle, Mail, Phone, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import NormalBanner from '@/components/banners/NormalBanner'
import { contactUsBannerData } from '@/data/data'
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI'
import { getFAQRoutePath } from '@/routes/routes'
import {
    FacebookIcon,
    TwitterIcon,
    InstagramIcon,
    YoutubeIcon,
    LinkedinIcon,
    PinterestIcon,
    WhatsAppIcon,
} from '@/components/ui/AllSVG'
import Link from 'next/link'

export default function ContactUsPage() {
    const { data: globalSettings } = useGetGlobalSettingsQuery();
    const gs = globalSettings?.data;

    const supportEmail = gs?.supportEmail || gs?.email;
    const phone = gs?.phone;
    const altPhone = gs?.alt_phone;
    const address = gs?.address;
    const platformName = gs?.platformName || gs?.marketplace_name;

    const socialLinks = [
        { href: gs?.facebook_link, label: 'Facebook', Icon: FacebookIcon, colorClass: 'text-primary', bgClass: 'bg-primary/10' },
        { href: gs?.x_link, label: 'Twitter / X', Icon: TwitterIcon, colorClass: 'text-secondary-accent', bgClass: 'bg-secondary-accent/10' },
        { href: gs?.instagram_link, label: 'Instagram', Icon: InstagramIcon, colorClass: 'text-pink-500', bgClass: 'bg-pink-500/10' },
        { href: gs?.youtube_link, label: 'YouTube', Icon: YoutubeIcon, colorClass: 'text-red-500', bgClass: 'bg-red-500/10' },
        { href: gs?.linkdin_link, label: 'LinkedIn', Icon: LinkedinIcon, colorClass: 'text-blue-600', bgClass: 'bg-blue-600/10' },
        { href: gs?.pinterest_link, label: 'Pinterest', Icon: PinterestIcon, colorClass: 'text-red-600', bgClass: 'bg-red-600/10' },
        { href: gs?.whatsapp_link, label: 'WhatsApp', Icon: WhatsAppIcon, colorClass: 'text-success', bgClass: 'bg-success/10' },
    ].filter(({ href }) => !!href);

    return (
        <>
            {/* Contact Us Banner */}
            <section className="relative py-16 md:pt-24 overflow-hidden bg-accent/30">
                <NormalBanner data={contactUsBannerData} />
            </section>

            {/* Contact Cards Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                        {/* Email Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Send us an email anytime
                            </p>
                            {supportEmail && (
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="text-primary hover:text-primary-dark font-medium text-sm break-all"
                                >
                                    {supportEmail}
                                </a>
                            )}
                        </div>

                        {/* Response Time Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-secondary-accent/10 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-7 h-7 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                We typically respond within
                            </p>
                            <p className="text-primary font-semibold text-sm">24-48 hours</p>
                        </div>

                        {/* Help Center Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Help Center</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Find quick answers
                            </p>
                            <Link
                                href={getFAQRoutePath()}
                                className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                                Browse FAQs
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">Send Us a Message</h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and we&apos;ll get back to you as soon as possible
                                </p>
                            </div>
                            <ContactUsPageForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Contact Methods */}
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Other Ways to Reach Us</h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the method that works best for you
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Social Media Card */}
                        {socialLinks.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-semibold mb-4">Connect on Social Media</h3>
                                <p className="text-muted-foreground mb-6">
                                    Follow {platformName ? `${platformName}` : 'us'} for updates, reading tips, and community highlights
                                </p>
                                <div className="space-y-3">
                                    {socialLinks.map(({ href, label, Icon, colorClass, bgClass }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-full bg-accent/50 hover:bg-accent transition-colors"
                                        >
                                            <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
                                                <Icon className={`h-5 w-5 ${colorClass}`} />
                                            </div>
                                            <span className="font-medium">{label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Details Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
                            <p className="text-muted-foreground mb-6">
                                Reach out to us directly through any of the channels below
                            </p>
                            <div className="space-y-4">
                                {supportEmail && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Email</p>
                                            <a
                                                href={`mailto:${supportEmail}`}
                                                className="text-sm text-primary hover:text-primary-dark break-all"
                                            >
                                                {supportEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary-accent/10 flex items-center justify-center shrink-0 mt-1">
                                            <Phone className="w-5 h-5 text-secondary-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Phone</p>
                                            <a
                                                href={`tel:${phone}`}
                                                className="text-sm text-primary hover:text-primary-dark"
                                            >
                                                {phone}
                                            </a>
                                            {altPhone && (
                                                <a
                                                    href={`tel:${altPhone}`}
                                                    className="block text-sm text-primary hover:text-primary-dark mt-0.5"
                                                >
                                                    {altPhone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {address && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-1">
                                            <MapPin className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Address</p>
                                            <p className="text-sm text-muted-foreground">{address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Looking for Quick Answers?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Check out our FAQ section for commonly asked questions
                        </p>
                        <Link href={getFAQRoutePath()}>
                            <Button className='global_btn rounded_full outline_primary hover-lift'>
                                Visit FAQ Page
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
