'use client'
import React from 'react'
import ContactUsPageForm from '@/components/forms/ContactUsPageForm'
import { Clock, HelpCircle, Mail, Phone, MapPin, Users, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'
import NormalBanner from '@/components/banners/NormalBanner'
import { contactUsBannerData } from '@/data/data'
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI'
import { getFAQRoutePath, getAuthorsRoutePath } from '@/routes/routes'
import {
    InstagramIcon,
    YoutubeIcon,
    LinkedinIcon,
    TikTokIcon,
} from '@/components/ui/AllSVG'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CONTACT_EMAILS = [
    { label: 'Partnerships', email: 'teamtaaluma@taaluma.world', color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Mentor Applications', email: 'mentors@taaluma.world', color: 'text-secondary-accent', bg: 'bg-secondary-accent/10' },
    { label: 'General Support', email: 'support@taaluma.world', color: 'text-success', bg: 'bg-success/10' },
]

export default function ContactUsPage() {
    const router = useRouter()
    const { data: globalSettings } = useGetGlobalSettingsQuery();
    const gs = globalSettings?.data;

    const phone = gs?.phone;
    const altPhone = gs?.alt_phone;
    const address = gs?.address;
    const platformName = gs?.platformName || gs?.marketplace_name;

    // Reordered: LinkedIn → YouTube → Instagram → TikTok
    const socialLinks = [
        { href: gs?.linkdin_link, label: 'LinkedIn', Icon: LinkedinIcon, colorClass: 'text-blue-600', bgClass: 'bg-blue-600/10' },
        { href: gs?.youtube_link, label: 'YouTube', Icon: YoutubeIcon, colorClass: 'text-red-500', bgClass: 'bg-red-500/10' },
        { href: gs?.instagram_link, label: 'Instagram', Icon: InstagramIcon, colorClass: 'text-pink-500', bgClass: 'bg-pink-500/10' },
        { href: gs?.tiktok_link, label: 'TikTok', Icon: TikTokIcon, colorClass: 'text-foreground', bgClass: 'bg-foreground/10' },
    ].filter(({ href }) => !!href);

    return (
        <>
            {/* Banner */}
            <section className="relative pt-16 overflow-hidden bg-accent/30">
                <NormalBanner data={contactUsBannerData} />
            </section>

            {/* Info Cards */}
            <section className="pt-4 sm:pt-8 bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                        {/* Email Us */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                            <p className="text-sm text-muted-foreground">
                                Questions, partnerships and general enquiries.
                            </p>
                        </div>

                        {/* Response Time */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-secondary-accent/10 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-7 h-7 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                We typically respond within 24-48 hours.
                            </p>
                            <p className="text-secondary-accent font-semibold text-sm">24-48 hours</p>
                        </div>

                        {/* Help Centre */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Help Centre</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Browse FAQs and common questions.
                            </p>
                            <Link
                                href={getFAQRoutePath()}
                                className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                                Browse FAQs
                            </Link>
                        </div>
                    </div>

                    {/* Share What You Know — Mentor Recruitment */}
                    <div className="max-w-3xl mx-auto mb-10">
                        <div className="bg-primary/5 border border-primary/15 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Users className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-foreground mb-1">Share What You Know</h3>
                                <p className="text-sm text-primary font-medium mb-2">Become a Mentor on Taaluma.World.</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Publish Blueprints. Build your reputation. Earn from your expertise. Impact the next generation.
                                </p>
                            </div>
                            <Button
                                className="global_btn rounded_full bg_primary shrink-0"
                                onPress={() => router.push(getAuthorsRoutePath())}
                            >
                                Become a Mentor
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">How Can We Help?</h2>
                                <p className="text-muted-foreground">
                                    Select the nature of your enquiry and we'll route it to the right team.
                                </p>
                            </div>
                            <ContactUsPageForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Contact Methods */}
            <section className="pt-4 sm:pt-8 bg-accent/30">
                <div className="container mx-auto sm:px-4">
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
                                <h3 className="text-xl font-semibold mb-2">Connect on Social Media</h3>
                                <p className="text-muted-foreground mb-6 text-sm">
                                    Follow {platformName ? platformName : 'us'} for updates and community highlights
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
                        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Contact Details</h3>
                                <p className="text-sm text-muted-foreground">Reach out directly through the right channel</p>
                            </div>

                            {/* Segmented emails */}
                            <div className="space-y-4">
                                {CONTACT_EMAILS.map(({ label, email, color, bg }) => (
                                    <div key={label} className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Mail className={`w-5 h-5 ${color}`} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${color}`}>{label}</p>
                                            <a
                                                href={`mailto:${email}`}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                                            >
                                                {email}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Phone / Address from settings */}
                            {(phone || address) && (
                                <div className="space-y-3 pt-2 border-t border-border">
                                    {phone && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Phone className="w-5 h-5 text-secondary-accent" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Phone</p>
                                                <a href={`tel:${phone}`} className="text-sm text-primary hover:text-primary-dark">{phone}</a>
                                                {altPhone && (
                                                    <a href={`tel:${altPhone}`} className="block text-sm text-primary hover:text-primary-dark mt-0.5">{altPhone}</a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {address && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <MapPin className="w-5 h-5 text-success" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Address</p>
                                                <p className="text-sm text-muted-foreground">{address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner With Taaluma */}
            <section className="pt-4 sm:pt-8 bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Partner With Taaluma</h2>
                                <p className="text-white/80 leading-relaxed">
                                    We collaborate with schools, universities, employers, professional bodies and communities to expand access to mentorship and career guidance.
                                </p>
                            </div>
                            <Button
                                className="global_btn rounded_full shrink-0 bg-white text-primary hover:bg-white/90 border-0"
                                onPress={() => router.push(getFAQRoutePath())}
                            >
                                Explore Partnerships
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="pt-4 sm:py-8 bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Have Questions?</h2>
                        <p className="text-lg text-muted-foreground">
                            Most answers can be found in our Frequently Asked Questions section.
                        </p>
                        <Link href={getFAQRoutePath()}>
                            <Button className='global_btn rounded_full outline_primary hover-lift'>
                                Visit FAQs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
