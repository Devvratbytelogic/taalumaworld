import React from 'react'
import { Users, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
    getContentOwnershipLicensingRoutePath,
    getMentorAgreementRoutePath,
    getPrivacyPolicyRoutePath,
} from '@/routes/routes'

export default function CommunityStandardsPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Mentor Legal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Community Standards Policy
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
                                    <h3 className="font-semibold mb-2">Building a Respectful Community</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Taaluma World is committed to a safe, inclusive, and professional environment for
                                        mentors and Career Architects. This policy sets the standards of conduct expected
                                        from all mentors on the platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">1. Respectful Interaction</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>All mentors must:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Treat all users with dignity and respect regardless of background</li>
                                        <li>Communicate professionally in all platform interactions</li>
                                        <li>Provide constructive, supportive feedback</li>
                                        <li>Refrain from harassment, discrimination, bullying, or intimidation</li>
                                        <li>Respect diverse perspectives and career paths</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">2. Mentorship Standards</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>As a mentor, you are expected to:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Accurately represent your qualifications, credentials, and experience</li>
                                        <li>Provide honest, ethical, and evidence-based career guidance</li>
                                        <li>Maintain appropriate professional boundaries with mentees and users</li>
                                        <li>Protect the confidentiality of private user information shared with you</li>
                                        <li>Not solicit users for off-platform services that circumvent platform fees</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">3. Prohibited Conduct</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>The following behaviors are strictly prohibited:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Hate speech, slurs, or content targeting protected characteristics</li>
                                        <li>Sexual harassment or inappropriate personal advances</li>
                                        <li>Sharing harmful, violent, or illegal content</li>
                                        <li>Spam, scams, or deceptive marketing practices</li>
                                        <li>Impersonation of other individuals or organizations</li>
                                        <li>Attempting to manipulate reviews, ratings, or platform systems</li>
                                        <li>Collecting user data without consent or platform authorization</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">4. Reporting & Enforcement</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Users may report violations through the platform or by contacting
                                        teamtaaluma@taaluma.world. Taaluma World investigates all reports and may take
                                        action including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Warning or temporary suspension of mentor privileges</li>
                                        <li>Removal of violating content</li>
                                        <li>Permanent termination of mentor account</li>
                                        <li>Withholding of pending payouts during investigations where appropriate</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">5. Appeals</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        If you believe an enforcement action was taken in error, you may submit an appeal
                                        to teamtaaluma@taaluma.world within 14 days of notification, including any
                                        supporting evidence. Taaluma World will review appeals and respond within a
                                        reasonable timeframe.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
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
                            <Link href={getMentorAgreementRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Mentor Agreement →
                            </Link>
                            <Link href={getContentOwnershipLicensingRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Content Ownership &amp; Licensing →
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
