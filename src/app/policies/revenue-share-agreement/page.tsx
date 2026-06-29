import React from 'react'
import { DollarSign, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
    getMentorAgreementRoutePath,
    getPrivacyPolicyRoutePath,
    getTermsOfServiceRoutePath,
} from '@/routes/routes'

export default function RevenueShareAgreementPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Mentor Legal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Revenue Share Agreement
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
                                    <h3 className="font-semibold mb-2">Payment Terms for Mentors</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        This Revenue Share Agreement defines how earnings from your content sales and
                                        mentorship services are calculated, processed, and distributed between you and
                                        Taaluma World.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">1. Revenue Share Structure</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        When users purchase your content (blueprints, series, or other digital products),
                                        revenue is split between you and Taaluma World according to the rates displayed
                                        in your mentor dashboard at the time of each transaction.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Mentor share: the percentage credited to your account after each qualifying sale</li>
                                        <li>Platform fee: covers hosting, payment processing, support, and platform operations</li>
                                        <li>Applicable taxes and payment processor fees may be deducted before revenue split</li>
                                    </ul>
                                    <p>
                                        Taaluma World will provide at least 30 days notice before any material change to
                                        the default revenue share rates for new sales.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">2. Payment Processing</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>Payments are processed through approved third-party payment providers including:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>M-Pesa, Stripe, PayPal, and KCB Bank Kenya (as available in your region)</li>
                                    </ul>
                                    <p>
                                        You are responsible for providing accurate payout details and keeping your payment
                                        information up to date. Taaluma World is not liable for delays caused by incorrect
                                        or incomplete payout information.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">3. Payout Schedule</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Earnings are tracked in your mentor dashboard in real time</li>
                                        <li>Payouts are processed on a monthly cycle, subject to a minimum payout threshold</li>
                                        <li>Funds may be held during dispute resolution or policy violation investigations</li>
                                        <li>Refunds or chargebacks on your content will be deducted from your earnings balance</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">4. Pricing & Promotions</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Mentors may set prices for their content within platform guidelines. Taaluma World
                                        may run platform-wide promotions or discounts with prior notice. Revenue from
                                        promotional sales is calculated on the actual amount paid by the customer.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">5. Tax Responsibilities</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        You are solely responsible for reporting and paying all applicable taxes on your
                                        earnings. Taaluma World may be required to collect tax information or withhold
                                        taxes where required by law.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">6. Disputes & Adjustments</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        If you believe there is an error in your earnings report, contact us within 30 days
                                        of the payout date at teamtaaluma@taaluma.world with supporting documentation.
                                        Taaluma World will investigate and respond within a reasonable timeframe.
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
                            <Link href={getTermsOfServiceRoutePath()} className="text-primary hover:text-primary/80 font-semibold">
                                Terms of Service →
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
