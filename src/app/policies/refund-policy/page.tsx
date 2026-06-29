import React from 'react';
import { RotateCcw, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import {
  getPrivacyPolicyRoutePath,
  getTermsOfServiceRoutePath,
} from '@/routes/routes';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-10 md:py-10 overflow-hidden bg-accent/30">
        <div className="container mx-auto sm:px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Refund Policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Last updated: January 9, 2026
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
                  <h3 className="font-semibold mb-2">Digital Purchases</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Taaluma World sells digital content, including individual blueprints and full
                    series. Because access is delivered instantly, refund eligibility is limited.
                    Please read this policy carefully before completing a purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">1. General Policy</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    All purchases on Taaluma World are for digital products and services. By
                    completing checkout, you acknowledge that you are buying digital content that
                    can be accessed immediately after payment.
                  </p>
                  <p>
                    Unless required by applicable law or covered by an exception listed below, all
                    sales are final. We do not offer refunds for change of mind, accidental
                    purchases, or dissatisfaction with content after it has been accessed.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">2. Blueprints &amp; Full Series</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>This policy applies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Individual blueprint purchases</li>
                    <li>Full series purchases</li>
                    <li>Any other digital reading content sold on the platform</li>
                  </ul>
                  <p>
                    <strong className="text-foreground">No refunds are provided once content has been accessed or downloaded.</strong>{' '}
                    Access includes opening, reading, or otherwise viewing purchased content in your
                    account or library.
                  </p>
                  <p>
                    If you have not yet accessed the purchased content, you may contact us within
                    7 days of purchase to request a review. Approval is at our sole discretion.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">3. Exceptions</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We may consider a refund in the following limited circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      A verified technical issue on our platform prevents you from accessing
                      purchased content
                    </li>
                    <li>
                      You were charged more than once for the same purchase due to a payment
                      processing error
                    </li>
                    <li>
                      You were charged but never received access to the purchased content
                    </li>
                    <li>Refunds are required under applicable consumer protection laws</li>
                  </ul>
                  <p>
                    Refund requests must be submitted within 7 days of the original purchase date.
                    We may ask for proof of the issue, such as screenshots, transaction details, or
                    error messages.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">4. How to Request a Refund</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>To request a refund review, contact us with:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your account email address</li>
                    <li>Order or transaction reference, if available</li>
                    <li>Date of purchase</li>
                    <li>A clear description of the issue</li>
                    <li>Supporting evidence where applicable</li>
                  </ul>
                  <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
                    <p>
                      <strong>Email:</strong> teamtaaluma@taaluma.world
                    </p>
                    <p>
                      <strong>Support:</strong> support@taaluma.world
                    </p>
                    <p>
                      <strong>Phone:</strong> +254718412926
                    </p>
                  </div>
                  <p>
                    We aim to respond to refund requests within 5–7 business days. Approved refunds
                    are processed to the original payment method and may take additional time to
                    appear depending on your bank or payment provider.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">5. Chargebacks &amp; Disputes</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you believe there is an issue with your purchase, please contact us before
                    initiating a chargeback or payment dispute. Unauthorized or fraudulent
                    chargebacks for legitimately delivered digital content may result in account
                    suspension.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">6. Future Services</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Additional services such as mentorship sessions and vision board features may be
                    introduced in future phases. Refund terms for those services will be published
                    separately when they become available.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Mentorship sessions: refund policies to be determined at launch</li>
                    <li>Vision Board and similar digital tools: no refunds once accessed</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">7. Policy Updates</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We may update this Refund Policy from time to time. Changes will be posted on
                    this page with an updated &quot;Last updated&quot; date. Continued use of the
                    platform after changes are posted constitutes acceptance of the revised policy.
                  </p>
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
              Review the terms and policies that apply to your Taaluma World account
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href={getTermsOfServiceRoutePath()}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Terms of Service →
              </Link>
              <Link
                href={getPrivacyPolicyRoutePath()}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
