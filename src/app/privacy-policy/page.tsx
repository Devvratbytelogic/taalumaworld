import React from 'react'
import { Shield, Lock, FileText, Cookie } from 'lucide-react';
import Link from 'next/link';
import { getTermsOfServiceRoutePath } from '@/routes/routes';

export default function PrivacyPolicyPage() {
    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative py-16 md:py-20 overflow-hidden bg-accent/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Privacy & Security</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Privacy Policy
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Last updated: January 9, 2026
                            </p>
                        </div>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-12 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Lock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Your Privacy is Important</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            At Taaluma, we take your privacy seriously. This Privacy Policy explains how we
                                            collect, use, protect, and share your personal information. Please read this policy
                                            carefully to understand our practices.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Section 1 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p className="font-semibold text-foreground">Information You Provide to Us:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Account Information:</strong> Name, email address, username, password, date of birth</li>
                                            <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by our payment partners)</li>
                                            <li><strong>Profile Information:</strong> Optional profile picture, reading preferences, favorite genres</li>
                                            <li><strong>Communications:</strong> Messages you send to our support team or through contact forms</li>
                                        </ul>

                                        <p className="font-semibold text-foreground pt-4">Information Collected Automatically:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Usage Data:</strong> Pages viewed, chapters read, time spent on platform, reading progress</li>
                                            <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
                                            <li><strong>Cookies & Similar Technologies:</strong> See our Cookie Policy section below</li>
                                            <li><strong>Location Data:</strong> General location based on IP address (not precise geolocation)</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>We use the information we collect to:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Provide and improve our services</li>
                                            <li>Process payments and maintain purchase records</li>
                                            <li>Send you updates about your account and purchases</li>
                                            <li>Personalize your reading experience and recommendations</li>
                                            <li>Respond to your questions and provide customer support</li>
                                            <li>Prevent fraud and ensure platform security</li>
                                            <li>Comply with legal obligations</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 3 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            We do not sell your personal information. We may share your information with:
                                        </p>

                                        <div className="space-y-3">
                                            <div className="bg-accent/50 rounded-2xl p-4">
                                                <p className="font-semibold text-foreground mb-2">Service Providers</p>
                                                <p className="text-sm">
                                                    Third-party companies that help us operate our platform (payment processors,
                                                    hosting services, email providers, analytics tools). They are contractually
                                                    obligated to protect your data.
                                                </p>
                                            </div>

                                            <div className="bg-accent/50 rounded-2xl p-4">
                                                <p className="font-semibold text-foreground mb-2">Authors</p>
                                                <p className="text-sm">
                                                    Limited information (username, purchase history of their content) may be shared
                                                    with authors to help them understand their readership.
                                                </p>
                                            </div>

                                            <div className="bg-accent/50 rounded-2xl p-4">
                                                <p className="font-semibold text-foreground mb-2">Legal Requirements</p>
                                                <p className="text-sm">
                                                    When required by law, court order, or government request, or to protect our rights,
                                                    property, or safety.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            We implement industry-standard security measures to protect your personal information:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Encryption of data in transit and at rest</li>
                                            <li>Secure payment processing through PCI-compliant partners</li>
                                            <li>Regular security audits and updates</li>
                                            <li>Access controls and authentication requirements</li>
                                            <li>Employee training on data protection practices</li>
                                        </ul>
                                        <p className="pt-4">
                                            However, no method of transmission over the internet is 100% secure. While we strive
                                            to protect your information, we cannot guarantee absolute security.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 5 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>Depending on your location, you may have the following rights:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                                            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                                        </ul>
                                        <p className="pt-4">
                                            To exercise these rights, please contact us at privacy@taaluma.world. We will respond
                                            to your request within 30 days.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 6 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            If you have questions, concerns, or requests regarding this Privacy Policy or our data
                                            practices, please contact us:
                                        </p>
                                        <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
                                            <p><strong>Privacy Team:</strong> privacy@taaluma.world</p>
                                            <p><strong>General Support:</strong> support@taaluma.world</p>
                                            <p><strong>Data Protection Officer:</strong> dpo@taaluma.world</p>
                                            <p><strong>Website:</strong> www.taaluma.world/contact</p>
                                        </div>
                                        <p className="pt-4">
                                            We will respond to your inquiry within 30 days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Links Section */}
                <section className="py-16 bg-accent/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">Related Information</h2>
                                <p className="text-muted-foreground">
                                    Learn more about your rights and our policies
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Terms Link */}
                                <Link
                                    href={getTermsOfServiceRoutePath()}
                                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                                Terms & Conditions
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Read our terms of service and user agreement
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Cookie Policy Link */}
                                <a
                                    href="#"
                                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center shrink-0">
                                            <Cookie className="w-6 h-6 text-secondary-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                                Cookie Settings
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Manage your cookie preferences and tracking options
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
