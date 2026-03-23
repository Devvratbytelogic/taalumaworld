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
                                Taaluma World Legal Policies
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                User Agreement · Privacy Policy · Cookie Policy · Last updated: January 2026
                            </p>
                        </div>
                    </div>
                </section>

                {/* Legal Policies Content */}
                <section className="py-12 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Lock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Service Provider</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Adayinthelifeof Ventures · 149 Water Front Gardens, Loresho, Waiyaki Way · P.O. Box 19499-00100, Nairobi, Kenya · Email: teamtaaluma@world.com · Phone: +254718412926
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* 1. USER AGREEMENT */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-2">1. User Agreement</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Last Updated: January 2026</p>

                                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.1 Introduction</h3>
                                            <p>Welcome to Taaluma World. By accessing or using our platform, you agree to be bound by this User Agreement. If you do not agree to these terms, please do not use our services.</p>
                                            <div className="mt-3">
                                                <p className="font-medium text-foreground">Service Provider:</p>
                                                <p>Adayinthelifeof Ventures</p>
                                                <p>149 Water Front Gardens, Loresho, Waiyaki Way</p>
                                                <p>P.O. Box 19499-00100, Nairobi, Kenya</p>
                                                <p>Email: teamtaaluma@world.com</p>
                                                <p>Phone: +254718412926</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.2 Services Offered</h3>
                                            <p>Taaluma World provides:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li><strong>Phase 1 (Current):</strong> Taaluma Digital Mini-books (available globally)</li>
                                                <li><strong>Phase 2 (Future):</strong> Taaluma Hub (mentorship platform) and Taaluma Digital Vision Board (restricted to Kenya and select African countries)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.3 Eligibility</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>You must be at least 13 years old to use our platform</li>
                                                <li>Users under 18 require parental/guardian consent</li>
                                                <li>You must provide accurate registration information</li>
                                                <li>You are responsible for maintaining the confidentiality of your account</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.4 User Conduct</h3>
                                            <p>You agree to:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Use the platform lawfully and respectfully</li>
                                                <li>Not misrepresent your identity, credentials, or experience</li>
                                                <li>Not engage in harassment, bullying, or inappropriate behavior</li>
                                                <li>Not share harmful, illegal, or offensive content</li>
                                                <li>Respect intellectual property rights</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.5 Content Ownership</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>You retain ownership of content you create</li>
                                                <li>By posting content, you grant Taaluma World a non-exclusive license to display and distribute it</li>
                                                <li>Taaluma Africa owns all platform design, software, and proprietary content</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.6 Payment Terms (Phase 1 – Digital Mini-Books)</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>All prices are displayed in applicable currency</li>
                                                <li>Payment is required before access to digital products</li>
                                                <li>Digital products are non-refundable once downloaded/accessed</li>
                                                <li>We reserve the right to modify pricing with notice</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.7 Future Mentorship Services (Phase 2)</h3>
                                            <p>When launched:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Both mentors and mentees can use the same account</li>
                                                <li>Mentors may set their own rates for services</li>
                                                <li>Platform fees will apply to mentorship transactions</li>
                                                <li>Separate terms will govern mentor-mentee relationships</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.8 Limitation of Liability</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Taaluma World provides career guidance tools, not professional advice</li>
                                                <li>We are not liable for decisions made based on platform content</li>
                                                <li>Services are provided &quot;as is&quot; without warranties</li>
                                                <li>Our liability is limited to the amount you paid for services</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.9 Termination</h3>
                                            <p>We reserve the right to suspend or terminate accounts for:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Violation of these terms</li>
                                                <li>Fraudulent activity</li>
                                                <li>Behavior harmful to the community</li>
                                                <li>Non-payment for services</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.10 Dispute Resolution</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Disputes will be governed by Kenyan law</li>
                                                <li>Parties agree to attempt mediation before litigation</li>
                                                <li>Jurisdiction lies with courts in Nairobi, Kenya</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">1.11 Changes to Terms</h3>
                                            <p>We may update these terms with 30 days notice via email or platform notification.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. PRIVACY POLICY */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-2">2. Privacy Policy</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Last Updated: January 2026</p>

                                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.1 Introduction</h3>
                                            <p>Taaluma World (hereinafter referred to as, &quot;we,&quot; &quot;our,&quot; &quot;us&quot;) respects your privacy. This policy explains how we collect, use, and protect your personal information in compliance with Kenya&apos;s Data Protection Act, 2019 and applicable African data protection regulations.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.2 Data Controller</h3>
                                            <p>Adayinthelifeof Ventures</p>
                                            <p>149 Water Front Gardens, Loresho, Waiyaki Way</p>
                                            <p>P.O. Box 19499-00100, Nairobi, Kenya</p>
                                            <p>Email: teamtaaluma@taaluma.world</p>
                                            <p>Phone: +254718412926</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.3 Information We Collect</h3>
                                            <p className="font-medium text-foreground mb-1">Information You Provide:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                                <li>Name, email address, phone number</li>
                                                <li>Date of birth (for age verification)</li>
                                                <li>Professional background and career information</li>
                                                <li>Educational history</li>
                                                <li>Profile information and preferences</li>
                                                <li>Payment information (processed through secure third-party providers)</li>
                                                <li>Communication content (messages, posts, comments)</li>
                                            </ul>
                                            <p className="font-medium text-foreground mb-1">Automatically Collected Information:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Device information (IP address, browser type, operating system)</li>
                                                <li>Usage data (pages visited, time spent, features used)</li>
                                                <li>Cookies and similar tracking technologies</li>
                                                <li>Location data (if permitted)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.4 How We Use Your Information</h3>
                                            <p>We use your information to:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Provide and improve our services</li>
                                                <li>Create and manage your account</li>
                                                <li>Process payments and transactions</li>
                                                <li>Match mentors with mentees (Phase 2)</li>
                                                <li>Send service updates and notifications</li>
                                                <li>Respond to inquiries and provide support</li>
                                                <li>Ensure platform security and prevent fraud</li>
                                                <li>Comply with legal obligations</li>
                                                <li>Analyze platform usage and improve user experience</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.5 Legal Basis for Processing (Kenya Data Protection Act, 2019)</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li><strong>Consent:</strong> You provide explicit consent for data processing</li>
                                                <li><strong>Contract Performance:</strong> Processing necessary to deliver services</li>
                                                <li><strong>Legal Obligation:</strong> Compliance with Kenyan and African laws</li>
                                                <li><strong>Legitimate Interests:</strong> Platform improvement and security</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.6 Information Sharing</h3>
                                            <p>We do NOT sell your personal information. We may share data with:</p>
                                            <div className="mt-3 space-y-3">
                                                <div>
                                                    <p className="font-medium text-foreground">Service Providers:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Payment processors (e.g., M-Pesa, Stripe, KCB Bank Limited)</li>
                                                        <li>Cloud hosting services</li>
                                                        <li>Email service providers</li>
                                                        <li>Analytics platforms</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Legal Requirements:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Government authorities when legally required</li>
                                                        <li>Law enforcement for valid legal requests</li>
                                                        <li>Protection of rights and safety</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Other Users:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Profile information visible to other users (as you choose)</li>
                                                        <li>Mentor/mentee matching information (Phase 2)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.7 Data Retention</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Active accounts: Data retained while account is active</li>
                                                <li>Inactive accounts: Data deleted after 3 years of inactivity</li>
                                                <li>Legal requirements: Some data retained longer for compliance</li>
                                                <li>You may request deletion at any time (subject to legal obligations)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.8 Your Rights (Kenya Data Protection Act)</h3>
                                            <p>You have the right to:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li><strong>Access:</strong> Request copies of your personal data</li>
                                                <li><strong>Correction:</strong> Update inaccurate information</li>
                                                <li><strong>Deletion:</strong> Request deletion of your data</li>
                                                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                                <li><strong>Object:</strong> Oppose certain processing activities</li>
                                                <li><strong>Withdraw Consent:</strong> Revoke consent at any time</li>
                                                <li><strong>Complain:</strong> Lodge complaints with the Office of the Data Protection Commissioner (Kenya)</li>
                                            </ul>
                                            <p className="mt-3">To exercise these rights, contact us at teamtaaluma@taaluma.world</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.9 Data Security</h3>
                                            <p>We implement appropriate technical and organizational measures:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Encryption of sensitive data</li>
                                                <li>Secure socket layer (SSL) technology</li>
                                                <li>Regular security assessments</li>
                                                <li>Access controls and authentication</li>
                                                <li>Staff training on data protection</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.10 International Data Transfers</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Data primarily stored in Kenya/African servers</li>
                                                <li>Some service providers may process data outside Africa</li>
                                                <li>We ensure adequate protection through appropriate safeguards</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.11 Children&apos;s Privacy</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Users under 18 require parental consent</li>
                                                <li>We do not knowingly collect data from children under 13 without consent</li>
                                                <li>Parents may request access to or deletion of their child&apos;s data</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.12 Changes to Privacy Policy</h3>
                                            <p>We will notify you of material changes via email or platform notification 30 days in advance.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">2.13 Contact Us</h3>
                                            <p>For privacy questions or to exercise your rights:</p>
                                            <p>Email: teamtaaluma@taaluma.world</p>
                                            <p>Phone: +254718412926</p>
                                            <p>Address: 149 Water Front Gardens, Loresho, Waiyaki Way, Nairobi</p>
                                            <p className="mt-3 font-medium text-foreground">Office of the Data Protection Commissioner (Kenya):</p>
                                            <p>Website: www.odpc.go.ke</p>
                                            <p>Email: info@odpc.go.ke</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. COOKIE POLICY */}
                                <div id="cookie-policy" className="bg-white rounded-3xl p-8 shadow-sm scroll-mt-24">
                                    <h2 className="text-2xl font-bold mb-2">3. Cookie Policy</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Last Updated: January 2026</p>

                                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.1 What Are Cookies?</h3>
                                            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience and understand how our platform is used.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.2 Types of Cookies We Use</h3>
                                            <div className="space-y-4 mt-2">
                                                <div>
                                                    <p className="font-medium text-foreground">Essential Cookies (Required)</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Enable core platform functionality</li>
                                                        <li>Remember login status</li>
                                                        <li>Maintain security</li>
                                                        <li>Process transactions</li>
                                                    </ul>
                                                    <p className="mt-1 text-sm italic">These cannot be disabled as they&apos;re essential for the platform to function.</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Performance Cookies (Optional)</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Analyze how users interact with the platform</li>
                                                        <li>Identify technical issues</li>
                                                        <li>Measure page load times</li>
                                                        <li>Track feature usage</li>
                                                    </ul>
                                                    <p className="mt-1 text-sm">Examples: Google Analytics</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Functionality Cookies (Optional)</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Remember your preferences</li>
                                                        <li>Save language settings</li>
                                                        <li>Personalize your experience</li>
                                                        <li>Remember career level and focus areas</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Marketing Cookies (Optional – Future)</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Track effectiveness of marketing campaigns</li>
                                                        <li>Personalize content recommendations</li>
                                                        <li>Measure conversion rates</li>
                                                    </ul>
                                                    <p className="mt-1 text-sm italic">Currently not in use; will notify before implementation.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.3 Third-Party Cookies</h3>
                                            <p>We may use third-party services that set cookies:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Analytics providers (Google Analytics)</li>
                                                <li>Payment processors (M-Pesa, Stripe, PayPal, KCB Bank Kenya)</li>
                                                <li>Social media platforms (LinkedIn integration)</li>
                                                <li>Cloud service providers</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.4 Cookie Duration</h3>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                                                <li><strong>Persistent Cookies:</strong> Remain until expiration or manual deletion (typically 30 days to 2 years)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.5 Managing Cookies</h3>
                                            <p>You can control cookies through:</p>
                                            <div className="space-y-3 mt-3">
                                                <div>
                                                    <p className="font-medium text-foreground">Browser Settings:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Most browsers allow you to refuse or delete cookies</li>
                                                        <li>Check your browser&apos;s &quot;Help&quot; section for instructions</li>
                                                        <li>Note: Disabling essential cookies may affect functionality</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Our Platform:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Cookie preference center (to be implemented)</li>
                                                        <li>Opt-out options for non-essential cookies</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Mobile Devices:</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                                                        <li>Adjust settings in your mobile device preferences</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.6 Do Not Track Signals</h3>
                                            <p>We currently do not respond to Do Not Track (DNT) browser signals as there is no universal standard.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.7 Updates to Cookie Policy</h3>
                                            <p>We may update this policy to reflect new technologies or legal requirements. Check the &quot;Last Updated&quot; date for the most recent version.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">3.8 Contact Us</h3>
                                            <p>Questions about our use of cookies?</p>
                                            <p>Email: teamtaaluma@taaluma.world</p>
                                            <p>Phone: +254718412926</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. ADDITIONAL POLICIES */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-6">4. Additional Recommended Policies</h2>

                                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">4.1 Refund Policy</h3>
                                            <p className="font-medium text-foreground mb-1">Digital Workbook:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                                                <li>No refunds once content is accessed/downloaded</li>
                                                <li>Refunds considered for technical issues preventing access</li>
                                                <li>Request refunds within 7 days of purchase</li>
                                                <li>Contact teamtaaluma@taaluma.world with proof of technical issue</li>
                                            </ul>
                                            <p className="font-medium text-foreground mb-1">Future Services (Phase 2):</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Mentorship sessions: Refund policies to be determined</li>
                                                <li>Vision Board: No refunds once accessed</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">4.2 Intellectual Property Policy</h3>
                                            <p className="font-medium text-foreground mb-1">Copyright Protection:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                                                <li>All Taaluma content is protected by copyright</li>
                                                <li>Users may not reproduce, distribute, or modify content without permission</li>
                                                <li>Report copyright infringement to teamtaaluma@taaluma.world</li>
                                            </ul>
                                            <p className="font-medium text-foreground mb-1">User-Generated Content:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>You retain copyright to your content</li>
                                                <li>You grant us license to display your content</li>
                                                <li>You must own or have rights to content you post</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">4.3 Community Guidelines (For Phase 2)</h3>
                                            <p className="font-medium text-foreground mb-1">Respectful Interaction:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                                                <li>Treat all users with dignity and respect</li>
                                                <li>No harassment, discrimination, or bullying</li>
                                                <li>Constructive feedback only</li>
                                                <li>Professional communication</li>
                                            </ul>
                                            <p className="font-medium text-foreground mb-1">Mentorship Standards:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li>Accurate representation of qualifications</li>
                                                <li>Honest and ethical guidance</li>
                                                <li>Appropriate boundaries</li>
                                                <li>Confidentiality of mentee information</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">4.4 Acceptable Use Policy</h3>
                                            <p>Prohibited Activities:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                                <li>Hacking or unauthorized access</li>
                                                <li>Spreading malware or viruses</li>
                                                <li>Spam or unsolicited marketing</li>
                                                <li>Impersonation</li>
                                                <li>Collection of user data without consent</li>
                                                <li>Commercial use without authorization</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. COMPLIANCE CHECKLIST */}
                                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold mb-4 text-foreground">5. Compliance Checklist</h2>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-center gap-2">✓ Kenya Data Protection Act, 2019</li>
                                        <li className="flex items-center gap-2">✓ African Union Convention on Cyber Security and Personal Data Protection</li>
                                        <li className="flex items-center gap-2">✓ Consumer Protection Act (Kenya)</li>
                                        <li className="flex items-center gap-2">✓ Copyright Act (Kenya)</li>
                                        <li className="flex items-center gap-2">✓ Computer Misuse and Cybercrimes Act (Kenya)</li>
                                    </ul>
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
                                    href="#cookie-policy"
                                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center shrink-0">
                                            <Cookie className="w-6 h-6 text-secondary-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                                Cookie Policy
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Read our cookie policy and types of cookies we use
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
