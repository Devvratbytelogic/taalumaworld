import React from 'react'
import { FileText, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
    getPrivacyPolicyRoutePath,
    getRevenueShareAgreementRoutePath,
    getTermsOfServiceRoutePath,
} from '@/routes/routes'

export default function MentorAgreementPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Mentor Legal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Mentor Agreement
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Last updated: January 2026
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Agreement Overview</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        This Mentor Agreement governs your relationship with Taaluma World as a content creator
                                        and mentor on our platform. By registering as a Mentor, you agree to these terms in
                                        addition to our general Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">1. Mentor Eligibility & Registration</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>To become a Mentor on Taaluma World, you must:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Be at least 18 years of age</li>
                                        <li>Provide accurate professional credentials and experience</li>
                                        <li>Complete the mentor registration and verification process</li>
                                        <li>Accept this Mentor Agreement and all related mentor policies</li>
                                    </ul>
                                    <p>
                                        Taaluma World reserves the right to approve, reject, or revoke mentor status at its
                                        discretion based on qualifications, conduct, or compliance with platform policies.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">2. Mentor Responsibilities</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>As a Mentor, you agree to:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Create high-quality, accurate, and original educational content</li>
                                        <li>Represent your qualifications and expertise honestly</li>
                                        <li>Provide career guidance that is ethical, constructive, and professional</li>
                                        <li>Respond to platform communications and content review requests promptly</li>
                                        <li>Maintain appropriate boundaries with Career Architects and users</li>
                                        <li>Comply with all applicable laws and platform policies</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">3. Content Standards</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>All mentor-created content must:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Be original or properly licensed by you</li>
                                        <li>Not infringe on third-party intellectual property rights</li>
                                        <li>Be free from harmful, discriminatory, or misleading material</li>
                                        <li>Meet Taaluma World&apos;s editorial and quality guidelines</li>
                                        <li>Undergo platform review before publication where required</li>
                                    </ul>
                                    <p>
                                        Taaluma World may edit, reject, or remove content that does not meet these standards
                                        without prior notice.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">4. Platform Relationship</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Mentors are independent content creators and not employees, agents, or partners of
                                        Taaluma World. You are responsible for your own tax obligations and business
                                        compliance in your jurisdiction.
                                    </p>
                                    <p>
                                        Taaluma World provides the platform, payment processing, and distribution infrastructure.
                                        Revenue sharing terms are governed by the{' '}
                                        <Link href={getRevenueShareAgreementRoutePath()} className="text-primary hover:text-primary/80 font-medium">
                                            Revenue Share Agreement
                                        </Link>.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">5. Account Suspension & Termination</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>Taaluma World may suspend or terminate your mentor account for:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Violation of this agreement or related policies</li>
                                        <li>Misrepresentation of credentials or experience</li>
                                        <li>Repeated content quality or community standards violations</li>
                                        <li>Fraudulent activity or payment disputes</li>
                                        <li>Behavior harmful to users or the platform community</li>
                                    </ul>
                                    <p>
                                        Upon termination, outstanding payments will be processed according to the Revenue
                                        Share Agreement, subject to any withholdings for disputes or policy violations.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>For questions about this Mentor Agreement, contact us:</p>
                                    <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
                                        <p><strong>Email:</strong> teamtaaluma@taaluma.world</p>
                                        <p><strong>Phone:</strong> +254718412926</p>
                                        <p><strong>Address:</strong> 149 Water Front Gardens, Loresho, Waiyaki Way, Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Related Policies</h2>
                        <p className="text-muted-foreground mb-6">
                            Review the full set of policies that apply to mentors on Taaluma World
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link href={getTermsOfServiceRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Terms of Service →
                            </Link>
                            <Link href={getRevenueShareAgreementRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Revenue Share Agreement →
                            </Link>
                            <Link href={getPrivacyPolicyRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Privacy Policy →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
