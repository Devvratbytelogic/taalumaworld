import React from 'react'
import ContactUsPageForm from '@/components/forms/ContactUsPageForm'
import { Clock, HelpCircle, Mail, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import NormalBanner from '@/components/banners/NormalBanner'
import { contactUsBannerData } from '@/data/data'

export default function ContactUsPage() {
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
                            <a
                                href="mailto:support@taaluma.world"
                                className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                                support@taaluma.world
                            </a>
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
                            <a
                                href="#"
                                className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                                Browse FAQs
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">Send Us a Message</h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and we'll get back to you as soon as possible
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
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Connect on Social Media</h3>
                            <p className="text-muted-foreground mb-6">
                                Follow us for updates, reading tips, and community highlights
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-3 rounded-full bg-accent/50 hover:bg-accent transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-semibold">f</span>
                                    </div>
                                    <span className="font-medium">Facebook</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-3 rounded-full bg-accent/50 hover:bg-accent transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-secondary-accent/10 flex items-center justify-center">
                                        <span className="text-secondary-accent font-semibold">𝕏</span>
                                    </div>
                                    <span className="font-medium">Twitter / X</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-3 rounded-full bg-accent/50 hover:bg-accent transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                        <span className="text-success font-semibold">in</span>
                                    </div>
                                    <span className="font-medium">Instagram</span>
                                </a>
                            </div>
                        </div>

                        {/* Business Inquiries Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Business Inquiries</h3>
                            <p className="text-muted-foreground mb-6">
                                For partnerships, press, or author onboarding
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">Partnerships</p>
                                        <a
                                            href="mailto:partners@taaluma.world"
                                            className="text-sm text-primary hover:text-primary-dark"
                                        >
                                            partners@taaluma.world
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary-accent/10 flex items-center justify-center shrink-0 mt-1">
                                        <Mail className="w-5 h-5 text-secondary-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">Press & Media</p>
                                        <a
                                            href="mailto:press@taaluma.world"
                                            className="text-sm text-primary hover:text-primary-dark"
                                        >
                                            press@taaluma.world
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-1">
                                        <Mail className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">Authors</p>
                                        <a
                                            href="mailto:authors@taaluma.world"
                                            className="text-sm text-primary hover:text-primary-dark"
                                        >
                                            authors@taaluma.world
                                        </a>
                                    </div>
                                </div>
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
                        <Button className='global_btn rounded_full outline_primary hover-lift'>
                            Visit FAQ Page
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}
