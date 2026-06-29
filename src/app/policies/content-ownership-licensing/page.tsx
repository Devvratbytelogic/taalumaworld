import React from 'react'
import { Copyright, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
    getCommunityStandardsRoutePath,
    getMentorAgreementRoutePath,
    getPrivacyPolicyRoutePath,
} from '@/routes/routes'

export default function ContentOwnershipLicensingPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                            <Copyright className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Mentor Legal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Content Ownership &amp; Licensing Policy
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
                                    <h3 className="font-semibold mb-2">Intellectual Property for Mentors</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        This policy explains how ownership and licensing of mentor-created content works on
                                        Taaluma World, including your rights and the license you grant to the platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">1. Your Ownership Rights</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        You retain full copyright ownership of all original content you create and upload
                                        to Taaluma World, including blueprints, series, written materials, videos, and
                                        other educational resources.
                                    </p>
                                    <p>
                                        You represent and warrant that you own or have obtained all necessary rights,
                                        licenses, and permissions for any content you publish on the platform.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">2. License Grant to Taaluma World</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>By publishing content on the platform, you grant Taaluma World a:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Non-exclusive, worldwide, royalty-bearing license</li>
                                        <li>Right to host, display, distribute, and promote your content on the platform</li>
                                        <li>Right to use excerpts for marketing and platform promotion with attribution</li>
                                        <li>Right to format or adapt content for technical delivery (e.g., streaming, downloads)</li>
                                    </ul>
                                    <p>
                                        This license remains in effect for as long as your content is available on the
                                        platform and for a reasonable period after removal for cached or archived copies.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">3. User License</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        When users purchase your content, they receive a personal, non-transferable,
                                        non-commercial license to access and use it for their own learning. Users may not:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Redistribute, resell, or share purchased content with others</li>
                                        <li>Reproduce content for commercial purposes</li>
                                        <li>Remove copyright notices or attribution</li>
                                        <li>Upload your content to other platforms without authorization</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">4. Platform-Owned Content</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Taaluma World owns all platform design, software, branding, and proprietary
                                        materials. Nothing in this policy transfers ownership of platform assets to mentors.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">5. Copyright Infringement</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        If you believe your copyright has been infringed on Taaluma World, or if your
                                        content is subject to a takedown notice, contact us at teamtaaluma@taaluma.world
                                        with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Identification of the copyrighted work</li>
                                        <li>Location of the infringing material on the platform</li>
                                        <li>Your contact information and a statement of good faith belief</li>
                                    </ul>
                                    <p>
                                        Repeat infringers may have their mentor accounts terminated in accordance with the{' '}
                                        <Link href={getMentorAgreementRoutePath()} className="text-primary hover:text-primary/80 font-medium">
                                            Mentor Agreement
                                        </Link>.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">6. Content Removal</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        You may request removal of your content from the platform at any time, subject to
                                        existing purchase obligations to users who have already bought access. Taaluma World
                                        may retain copies as required by law or for legitimate business purposes.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
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
                            <Link href={getCommunityStandardsRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Community Standards →
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
