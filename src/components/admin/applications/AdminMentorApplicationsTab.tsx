'use client';

import { useState } from 'react';
import { Eye, Save, X } from 'lucide-react';
import { Button } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UiButton from '@/components/ui/Button';
import toast from '@/utils/toast';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSearchInput,
  AdminSearchPanel,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import {
  APPLICATION_STATUS_COLORS,
  INITIAL_CONVERSION_APPLICATIONS,
  INITIAL_VERIFICATION_APPLICATIONS,
  type ApplicationStatus,
  type MentorConversionApplication,
  type MentorVerificationApplication,
} from '@/components/admin/applications/data/mentorApplicationsData';

const STATUSES: ApplicationStatus[] = ['Pending Review', 'Approved', 'Waitlisted', 'Rejected', 'Suspended'];

export function AdminMentorApplicationsTab() {
  const [tab, setTab] = useState<'conversion' | 'verification'>('conversion');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversionApps, setConversionApps] = useState(INITIAL_CONVERSION_APPLICATIONS);
  const [verificationApps, setVerificationApps] = useState(INITIAL_VERIFICATION_APPLICATIONS);
  const [reviewConversion, setReviewConversion] = useState<MentorConversionApplication | null>(null);
  const [reviewVerification, setReviewVerification] = useState<MentorVerificationApplication | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ApplicationStatus>('Pending Review');
  const [reviewNotes, setReviewNotes] = useState('');

  const search = searchQuery.trim().toLowerCase();

  const conversionList = search
    ? conversionApps.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(search) ||
          app.applicantEmail.toLowerCase().includes(search) ||
          app.status.toLowerCase().includes(search),
      )
    : conversionApps;

  const verificationList = search
    ? verificationApps.filter(
        (app) =>
          app.mentorName.toLowerCase().includes(search) ||
          app.mentorEmail.toLowerCase().includes(search) ||
          app.status.toLowerCase().includes(search),
      )
    : verificationApps;

  const openConversionReview = (app: MentorConversionApplication) => {
    setReviewConversion(app);
    setReviewStatus(app.status);
    setReviewNotes(app.adminNotes ?? '');
  };

  const openVerificationReview = (app: MentorVerificationApplication) => {
    setReviewVerification(app);
    setReviewStatus(app.status);
    setReviewNotes(app.adminNotes ?? '');
  };

  const closeReview = () => {
    setReviewConversion(null);
    setReviewVerification(null);
  };

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Applications"
        description="Review Career Architect conversion requests and Verified Mentor applications."
      />

      <AdminPanel>
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setTab('conversion')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'conversion' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Career Architect → Mentor
          </button>
          <button
            type="button"
            onClick={() => setTab('verification')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'verification' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Verified Mentor badge
          </button>
        </div>

        <div className="mt-4">
          <AdminSearchPanel>
            <AdminSearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search applications..." />
          </AdminSearchPanel>
        </div>
      </AdminPanel>

      {tab === 'conversion' ? (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Applicant</TableHead>
                <TableHead className="px-4">Submitted</TableHead>
                <TableHead className="px-4">Experience</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="w-24 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversionList.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="px-4">
                    <p className="font-medium text-slate-900">{app.applicantName}</p>
                    <p className="text-xs text-slate-500">{app.applicantEmail}</p>
                  </TableCell>
                  <TableCell className="px-4 text-slate-600">
                    {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-4 text-slate-600">{app.yearsOfExperience} yrs</TableCell>
                  <TableCell className="px-4">
                    <Badge variant="outline" className={APPLICATION_STATUS_COLORS[app.status]}>{app.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Button size="sm" variant="flat" className="rounded-lg" onPress={() => openConversionReview(app)}>
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Mentor</TableHead>
                <TableHead className="px-4">Submitted</TableHead>
                <TableHead className="px-4">Mentor type</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="w-24 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationList.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="px-4">
                    <p className="font-medium text-slate-900">{app.mentorName}</p>
                    <p className="text-xs text-slate-500">{app.mentorEmail}</p>
                  </TableCell>
                  <TableCell className="px-4 text-slate-600">
                    {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-4 text-slate-600">{app.mentorType}</TableCell>
                  <TableCell className="px-4">
                    <Badge variant="outline" className={APPLICATION_STATUS_COLORS[app.status]}>{app.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Button size="sm" variant="flat" className="rounded-lg" onPress={() => openVerificationReview(app)}>
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableShell>
      )}

      <Dialog open={!!reviewConversion} onOpenChange={(open) => !open && closeReview()}>
        <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {reviewConversion ? (
            <>
              <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
                <DialogTitle>Review mentor application</DialogTitle>
                <DialogDescription>{reviewConversion.applicantName} · {reviewConversion.applicantEmail}</DialogDescription>
              </DialogHeader>

              <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto px-8 py-4 text-sm">
                <p><span className="text-slate-500">Experience:</span> {reviewConversion.yearsOfExperience} years</p>
                {reviewConversion.linkedinUrl ? <p><span className="text-slate-500">LinkedIn:</span> {reviewConversion.linkedinUrl}</p> : null}
                {reviewConversion.facebookUrl ? <p><span className="text-slate-500">Facebook:</span> {reviewConversion.facebookUrl}</p> : null}
                {reviewConversion.xUrl ? <p><span className="text-slate-500">X:</span> {reviewConversion.xUrl}</p> : null}
                {reviewConversion.personalWebsite ? <p><span className="text-slate-500">Website:</span> {reviewConversion.personalWebsite}</p> : null}
                <p><span className="text-slate-500">Career summary:</span> {reviewConversion.careerSummary}</p>
                <p><span className="text-slate-500">Bank:</span> {reviewConversion.bankName} · {reviewConversion.accountName} · {reviewConversion.accountNumber}</p>
                {reviewStatus === 'Approved' ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Approving activates Mentor privileges automatically.</p> : null}
                {reviewStatus === 'Rejected' ? <p className="rounded-lg bg-amber-50 px-4 py-3 text-amber-800">Rejected applicants may reapply after 30 days.</p> : null}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={reviewStatus} onValueChange={(v) => setReviewStatus(v as ApplicationStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversion-notes">Admin notes</Label>
                  <Textarea id="conversion-notes" rows={3} value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} />
                </div>
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview}>
                  <X className="h-4 w-4" /> Cancel
                </UiButton>
                <UiButton
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={() => {
                    setConversionApps((prev) =>
                      prev.map((app) =>
                        app.id === reviewConversion.id ? { ...app, status: reviewStatus, adminNotes: reviewNotes } : app,
                      ),
                    );
                    toast.success('Application updated');
                    closeReview();
                  }}
                >
                  <Save className="h-4 w-4" /> Save
                </UiButton>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!reviewVerification} onOpenChange={(open) => !open && closeReview()}>
        <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          {reviewVerification ? (
            <>
              <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
                <DialogTitle>Review verification request</DialogTitle>
                <DialogDescription>{reviewVerification.mentorName} · {reviewVerification.mentorEmail}</DialogDescription>
              </DialogHeader>

              <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto px-8 py-4 text-sm">
                <p><span className="text-slate-500">Mentor type:</span> {reviewVerification.mentorType}</p>
                {reviewVerification.notes ? <p><span className="text-slate-500">Notes:</span> {reviewVerification.notes}</p> : null}
                {reviewStatus === 'Approved' ? (
                  <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">
                    Approving assigns the Verified badge and VERIFIED tier (75/25).
                  </p>
                ) : null}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={reviewStatus} onValueChange={(v) => setReviewStatus(v as ApplicationStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verification-notes">Admin notes</Label>
                  <Textarea id="verification-notes" rows={3} value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} />
                </div>
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview}>
                  <X className="h-4 w-4" /> Cancel
                </UiButton>
                <UiButton
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={() => {
                    setVerificationApps((prev) =>
                      prev.map((app) =>
                        app.id === reviewVerification.id ? { ...app, status: reviewStatus, adminNotes: reviewNotes } : app,
                      ),
                    );
                    toast.success('Verification request updated');
                    closeReview();
                  }}
                >
                  <Save className="h-4 w-4" /> Save
                </UiButton>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
