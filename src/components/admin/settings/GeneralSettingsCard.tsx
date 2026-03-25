'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Save, Settings, X } from 'lucide-react';
import { useFormik } from 'formik';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import Button from '../../ui/Button';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { globalSettingsSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import AdminSettingsSkeleton from '@/components/skeleton-loader/AdminSettingsSkeleton';

const defaultValues = {
  platformName: '',
  marketplace_name: '',
  platformDescription: '',
  supportEmail: '',
  email: '',
  phone: '',
  alt_phone: '',
  address: '',
  copy_right_text: '',
  header_text: '',
  header_text_status: false,
  visible: 'chapter',
  checkout_status: false,
  android_app_url: '',
  iphone_app_url: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_tag: '',
  search_console: '',
  schema_markup: '',
  google_analytics_id: '',
  google_tag_manager: '',
  facebook_pixel: '',
  microsoft_clarity: '',
  bing_tracking_code: '',
  instagram_link: '',
  facebook_link: '',
  x_link: '',
  youtube_link: '',
  linkdin_link: '',
  pinterest_link: '',
  whatsapp_link: '',
  emailNotificationsNewUsers: false,
  emailNotificationsPurchases: false,
  dailySummaryReports: false,
  alertFlaggedContent: false,
};

type FormValues = typeof defaultValues;



function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-500">{msg}</p>;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2 mb-4">
      {title}
    </h4>
  );
}

function CheckboxField({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none text-sm">
      <input
        id={id}
        name={id}
        type="checkbox"
        className="h-4 w-4 accent-blue-600"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

export function GeneralSettingsCard() {
  const { data: res, isLoading } = useGetAdminGlobalSettingsQuery();
  const [updateGlobalSettings, { isLoading: isUpdating }] = useUpdateGlobalSettingsMutation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const data = res?.data;

  const initialValues: FormValues = {
    platformName: data?.platformName ?? '',
    marketplace_name: data?.marketplace_name ?? '',
    platformDescription: data?.platformDescription ?? '',
    supportEmail: data?.supportEmail ?? '',
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    alt_phone: data?.alt_phone ?? '',
    address: data?.address ?? '',
    copy_right_text: data?.copy_right_text ?? '',
    header_text: data?.header_text ?? '',
    header_text_status: data?.header_text_status ?? false,
    visible: data?.visible ?? 'chapter',
    checkout_status: data?.checkout_status ?? false,
    android_app_url: data?.android_app_url ?? '',
    iphone_app_url: data?.iphone_app_url ?? '',
    meta_title: data?.meta_title ?? '',
    meta_description: data?.meta_description ?? '',
    meta_keywords: data?.meta_keywords ?? '',
    og_tag: data?.og_tag ?? '',
    search_console: data?.search_console ?? '',
    schema_markup: data?.schema_markup ?? '',
    google_analytics_id: data?.google_analytics_id ?? '',
    google_tag_manager: data?.google_tag_manager ?? '',
    facebook_pixel: data?.facebook_pixel ?? '',
    microsoft_clarity: data?.microsoft_clarity ?? '',
    bing_tracking_code: data?.bing_tracking_code ?? '',
    instagram_link: data?.instagram_link ?? '',
    facebook_link: data?.facebook_link ?? '',
    x_link: data?.x_link ?? '',
    youtube_link: data?.youtube_link ?? '',
    linkdin_link: data?.linkdin_link ?? '',
    pinterest_link: data?.pinterest_link ?? '',
    whatsapp_link: data?.whatsapp_link ?? '',
    emailNotificationsNewUsers: data?.emailNotificationsNewUsers ?? false,
    emailNotificationsPurchases: data?.emailNotificationsPurchases ?? false,
    dailySummaryReports: data?.dailySummaryReports ?? false,
    alertFlaggedContent: data?.alertFlaggedContent ?? false,
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: globalSettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
          formData.append(key, String(values[key]));
        });
        if (logoFile) formData.append('logo', logoFile);
        await updateGlobalSettings(formData).unwrap();
        toast.success('Settings updated successfully');
      } catch {
        toast.error('Failed to update settings. Please try again.');
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  const field = (name: keyof FormValues) => ({
    id: name as string,
    name: name as string,
    value: values[name] as string,
    onChange: handleChange,
    onBlur: handleBlur,
    className: `mt-2${errors[name] && touched[name] ? ' border-red-500' : ''}`,
  });

  if (isLoading) {
    return <AdminSettingsSkeleton />;
  }

  return (
    <Card className="p-6 rounded-3xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">General Settings</h3>
          <p className="text-sm text-muted-foreground">Platform configuration and preferences</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Platform Info ── */}
          <section>
            <SectionHeading title="Platform Info" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name *</Label>
                  <Input {...field('platformName')} />
                  <FieldError msg={touched.platformName ? errors.platformName : ''} />
                </div>
                <div>
                  <Label htmlFor="marketplace_name">Marketplace Name *</Label>
                  <Input {...field('marketplace_name')} />
                  <FieldError msg={touched.marketplace_name ? errors.marketplace_name : ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Textarea {...field('platformDescription')} rows={3} />
                <FieldError msg={touched.platformDescription ? errors.platformDescription : ''} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportEmail">Support Email *</Label>
                  <Input type="email" {...field('supportEmail')} />
                  <FieldError msg={touched.supportEmail ? errors.supportEmail : ''} />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input type="email" {...field('email')} />
                  <FieldError msg={touched.email ? errors.email : ''} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input {...field('phone')} />
                  <FieldError msg={touched.phone ? errors.phone : ''} />
                </div>
                <div>
                  <Label htmlFor="alt_phone">Alternate Phone</Label>
                  <Input {...field('alt_phone')} />
                  <FieldError msg={touched.alt_phone ? errors.alt_phone : ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea {...field('address')} rows={2} />
                <FieldError msg={touched.address ? errors.address : ''} />
              </div>
              <div>
                <Label htmlFor="copy_right_text">Copyright Text</Label>
                <Input {...field('copy_right_text')} />
                <FieldError msg={touched.copy_right_text ? errors.copy_right_text : ''} />
              </div>

              {/* Logo upload */}
              <div>
                <Label>Platform Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  {/* Preview */}
                  {(logoFile || data?.logo) && (
                    <div className="relative h-16 w-16 rounded-xl border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={logoFile ? URL.createObjectURL(logoFile) : (data?.logo as unknown as string)}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-1"
                      />
                      {logoFile && (
                        <button
                          type="button"
                          onClick={() => { setLogoFile(null); if (logoInputRef.current) logoInputRef.current.value = ''; }}
                          className="absolute top-0.5 right-0.5 rounded-full bg-white shadow p-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                  {/* File select button */}
                  <div className="flex-1">
                    <input
                      ref={logoInputRef}
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-input bg-gray-50 hover:bg-gray-100 text-sm text-muted-foreground transition-colors w-full"
                    >
                      <ImagePlus className="h-4 w-4 shrink-0" />
                      {logoFile ? (
                        <span className="truncate text-foreground font-medium">{logoFile.name}</span>
                      ) : (
                        <span>Click to select a logo image</span>
                      )}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG, SVG or WebP recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Header & Display ── */}
          <section>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Content Visibility Mode</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Platform is currently in <span className="font-semibold">{values.visible === 'book' ? 'Book' : 'Chapter'}</span> mode
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-sm font-medium transition-colors', values.visible === 'chapter' ? 'text-primary' : 'text-muted-foreground')}>
                    Chapter
                  </span>
                  <Switch
                    checked={values.visible === 'book'}
                    onCheckedChange={(checked) => formik.setFieldValue('visible', checked ? 'book' : 'chapter')}
                  />
                  <span className={cn('text-sm font-medium transition-colors', values.visible === 'book' ? 'text-primary' : 'text-muted-foreground')}>
                    Book
                  </span>
                </div>
              </div>
            </div>
          </section>


          {/* ── SEO ── */}
          <section>
            <SectionHeading title="SEO" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input {...field('meta_title')} />
                  <FieldError msg={touched.meta_title ? errors.meta_title : ''} />
                </div>
                <div>
                  <Label htmlFor="og_tag">OG Tag</Label>
                  <Input {...field('og_tag')} />
                  <FieldError msg={touched.og_tag ? errors.og_tag : ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea {...field('meta_description')} rows={2} />
                <FieldError msg={touched.meta_description ? errors.meta_description : ''} />
              </div>
              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input {...field('meta_keywords')} placeholder="books, reading, chapters" />
                <FieldError msg={touched.meta_keywords ? errors.meta_keywords : ''} />
              </div>
              <div>
                <Label htmlFor="search_console">Search Console Verification</Label>
                <Input {...field('search_console')} placeholder="google-site-verification=..." />
                <FieldError msg={touched.search_console ? errors.search_console : ''} />
              </div>
              <div>
                <Label htmlFor="schema_markup">Schema Markup</Label>
                <Textarea {...field('schema_markup')} rows={3} placeholder='<script type="application/ld+json">...</script>' className={`mt-2 font-mono text-sm${errors.schema_markup && touched.schema_markup ? ' border-red-500' : ''}`} />
                <FieldError msg={touched.schema_markup ? errors.schema_markup : ''} />
              </div>
            </div>
          </section>

          {/* ── Analytics ── */}
          <section>
            <SectionHeading title="Analytics & Tracking" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input {...field('google_analytics_id')} placeholder="G-XXXXXXX" />
                <FieldError msg={touched.google_analytics_id ? errors.google_analytics_id : ''} />
              </div>
              <div>
                <Label htmlFor="google_tag_manager">Google Tag Manager</Label>
                <Input {...field('google_tag_manager')} placeholder="GTM-XXXXXX" />
                <FieldError msg={touched.google_tag_manager ? errors.google_tag_manager : ''} />
              </div>
              <div>
                <Label htmlFor="facebook_pixel">Facebook Pixel</Label>
                <Input {...field('facebook_pixel')} placeholder="1234567890" />
                <FieldError msg={touched.facebook_pixel ? errors.facebook_pixel : ''} />
              </div>
              <div>
                <Label htmlFor="microsoft_clarity">Microsoft Clarity</Label>
                <Input {...field('microsoft_clarity')} placeholder="clarity-code" />
                <FieldError msg={touched.microsoft_clarity ? errors.microsoft_clarity : ''} />
              </div>
              <div>
                <Label htmlFor="bing_tracking_code">Bing Tracking Code</Label>
                <Input {...field('bing_tracking_code')} placeholder="bing-code" />
                <FieldError msg={touched.bing_tracking_code ? errors.bing_tracking_code : ''} />
              </div>
            </div>
          </section>

          {/* ── Social Links ── */}
          <section>
            <SectionHeading title="Social Links" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  ['instagram_link', 'Instagram', 'https://instagram.com/...'],
                  ['facebook_link', 'Facebook', 'https://facebook.com/...'],
                  ['x_link', 'X (Twitter)', 'https://x.com/...'],
                  ['youtube_link', 'YouTube', 'https://youtube.com/...'],
                  ['linkdin_link', 'LinkedIn', 'https://linkedin.com/...'],
                  ['pinterest_link', 'Pinterest', 'https://pinterest.com/...'],
                  ['whatsapp_link', 'WhatsApp', 'https://wa.me/...'],
                ] as [string, string, string][]
              ).map(([name, label, placeholder]) => {
                const key = name as keyof FormValues;
                return (
                  <div key={name}>
                    <Label htmlFor={name}>{label}</Label>
                    <Input {...field(key)} placeholder={placeholder} />
                    <FieldError msg={touched[key] ? (errors[key] as string) : ''} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Notifications ── */}
          <section>
            <SectionHeading title="Email Notifications" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxField
                id="emailNotificationsNewUsers"
                label="New user registrations"
                checked={values.emailNotificationsNewUsers}
                onChange={handleChange}
              />
              <CheckboxField
                id="emailNotificationsPurchases"
                label="New purchases"
                checked={values.emailNotificationsPurchases}
                onChange={handleChange}
              />
              <CheckboxField
                id="dailySummaryReports"
                label="Daily summary reports"
                checked={values.dailySummaryReports}
                onChange={handleChange}
              />
              <CheckboxField
                id="alertFlaggedContent"
                label="Alert on flagged content"
                checked={values.alertFlaggedContent}
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="gap-2 global_btn rounded_full bg_primary"
              disabled={isUpdating || formik.isSubmitting}
              isLoading={isUpdating || formik.isSubmitting}
              endContent={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
