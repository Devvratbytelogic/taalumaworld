import React from 'react'
import { GraduationCap, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getPrivacyPolicyRoutePath, getTermsOfServiceRoutePath } from '@/routes/routes'

export default function InstitutionalAccessTermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">University Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            Institutional Access Terms
                        </h1>
                        <p className="text-lg text-muted-foreground">Last updated: January 2026</p>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    These terms apply when you register with an institutional email address from a
                                    partner university to access promotional Taaluma World content.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6 text-muted-foreground leading-relaxed">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">1. Eligibility</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>You must be a current student or authorized member of a partner institution</li>
                                    <li>You must register using your official institutional email address</li>
                                    <li>You must not share your account credentials with non-eligible users</li>
                                    <li>Institutional access is verified against approved email domains</li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">2. Promotional Access</h2>
                                <p>
                                    Partner institutions may provide time-limited access to selected blueprints at no
                                    charge during a promotional period. Access duration and content availability are
                                    determined by your institution&apos;s agreement with Taaluma World.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">3. Post-Promotion Access</h2>
                                <p>
                                    When the promotional period ends, continued access may require purchase at standard
                                    or institution-negotiated discounted rates. You will receive advance notice before
                                    promotional access expires.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">4. Misuse & Termination</h2>
                                <p>
                                    Taaluma World may revoke institutional access if you provide false eligibility
                                    information, use a non-institutional email, or violate platform terms.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
                                <p>Email: teamtaaluma@taaluma.world · Phone: +254718412926</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-accent/30">
                <div className="container mx-auto sm:px-4 max-w-3xl text-center">
                    <Shield className="w-7 h-7 text-primary mx-auto mb-4" />
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href={getTermsOfServiceRoutePath()} className="text-primary font-semibold">
                            Terms of Service →
                        </Link>
                        <Link href={getPrivacyPolicyRoutePath()} className="text-primary font-semibold">
                            Privacy Policy →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
