import React from 'react'
import { FileText, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getPrivacyPolicyRoutePath } from '@/routes/routes';


export default function TermsOfServicePage() {
    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative py-16 md:py-20 overflow-hidden bg-accent/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Legal</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Terms & Conditions
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
                                        <AlertCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Please Read Carefully</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            By accessing and using Taaluma.world, you agree to be bound by these Terms and
                                            Conditions. If you do not agree with any part of these terms, please do not use
                                            our platform.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Section 1 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            Welcome to Taaluma! These Terms and Conditions ("Terms") govern your access to and
                                            use of the Taaluma.world platform, including any content, functionality, and services
                                            offered on or through our website and applications.
                                        </p>
                                        <p>
                                            By creating an account, purchasing content, or using any part of our platform, you
                                            acknowledge that you have read, understood, and agree to be bound by these Terms, as
                                            well as our Privacy Policy.
                                        </p>
                                        <p>
                                            If you are under 18 years old, you must have permission from a parent or legal guardian
                                            to use Taaluma. By using our platform, you confirm that you have obtained such permission.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">2. Account Registration</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            To access certain features of Taaluma, you may be required to create an account. When
                                            creating an account, you agree to:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Provide accurate, current, and complete information</li>
                                            <li>Maintain and update your information to keep it accurate and current</li>
                                            <li>Keep your password secure and confidential</li>
                                            <li>Notify us immediately of any unauthorized access to your account</li>
                                            <li>Accept responsibility for all activities that occur under your account</li>
                                        </ul>
                                        <p>
                                            We reserve the right to suspend or terminate accounts that violate these Terms or
                                            provide false information.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 3 */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">3. Content Purchases & Pricing</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            Taaluma offers two primary purchasing models:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Chapter-by-Chapter:</strong> Purchase individual chapters of books at listed prices</li>
                                            <li><strong>Full Book:</strong> Purchase complete books when available</li>
                                        </ul>
                                        <p>
                                            All prices are displayed in USD and include applicable taxes. Prices may vary by content
                                            and are subject to change at the author's or platform's discretion. Any price changes
                                            will not affect purchases already completed.
                                        </p>
                                        <p>
                                            Purchased content is licensed to you for personal, non-commercial use only. You may not
                                            share, redistribute, or resell purchased content.
                                        </p>
                                    </div>
                                </div>

                                {/* Additional sections - abbreviated for token efficiency */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            Payment for all purchases must be made through our approved payment processors. By
                                            making a purchase, you agree to provide valid payment information and pay all charges
                                            incurred. All sales are final. We do not offer refunds except as required by law or in
                                            cases of technical errors that prevent access to purchased content.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">5. User Conduct</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>You agree not to use Taaluma to:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Violate any laws or regulations</li>
                                            <li>Infringe upon intellectual property rights</li>
                                            <li>Share account credentials with others</li>
                                            <li>Attempt to circumvent payment systems or security measures</li>
                                            <li>Upload viruses, malware, or harmful code</li>
                                            <li>Harass, abuse, or harm other users</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
                                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            If you have questions about these Terms and Conditions, please contact us:
                                        </p>
                                        <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
                                            <p><strong>Email:</strong> legal@taaluma.world</p>
                                            <p><strong>Support:</strong> support@taaluma.world</p>
                                            <p><strong>Website:</strong> www.taaluma.world</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-16 bg-accent/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Privacy Matters</h2>
                            <p className="text-muted-foreground mb-6">
                                Learn how we protect and handle your personal information
                            </p>
                            <Link
                                href={getPrivacyPolicyRoutePath()}
                                className="inline-block text-primary hover:text-primary-dark font-semibold"
                            >
                                Read our Privacy Policy →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
