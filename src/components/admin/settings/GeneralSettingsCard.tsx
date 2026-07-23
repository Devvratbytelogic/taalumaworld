'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Save, Settings, X } from 'lucide-react';
import { useFormik } from 'formik';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import Button from '../../ui/Button';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { globalSettingsSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import AdminSettingsSkeleton from '@/components/skeleton-loader/AdminSettingsSkeleton';
import { OpenGraphFieldsSection } from '@/components/admin/shared/OpenGraphFieldsSection';

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
  default_tax_rate: 0,
  header_text: '',
  header_text_status: false,
  visible: 'chapter',
  checkout_status: false,
  android_app_url: '',
  iphone_app_url: '',
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: null as File | string | null,
  json_ld: '',
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
  tiktok_link: '',
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
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreviewUrl, setOgImagePreviewUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ogImageIsObjectUrlRef = useRef(false);

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
    default_tax_rate: data?.default_tax_rate ?? 0,
    header_text: data?.header_text ?? '',
    header_text_status: data?.header_text_status ?? false,
    visible: data?.visible ?? 'chapter',
    checkout_status: data?.checkout_status ?? false,
    android_app_url: data?.android_app_url ?? '',
    iphone_app_url: data?.iphone_app_url ?? '',
    meta_title: data?.meta_title ?? '',
    meta_description: data?.meta_description ?? '',
    og_title: data?.og_title ?? data?.og_tag ?? '',
    og_description: data?.og_description ?? '',
    og_image: data?.og_image ?? null,
    json_ld: data?.json_ld ?? data?.schema_markup ?? '',
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
    tiktok_link: data?.tiktok_link ?? '',
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
          if (key === 'og_image') return;
          formData.append(key, String(values[key]));
        });
        if (logoFile) formData.append('logo', logoFile);
        if (ogImageFile) formData.append('og_image', ogImageFile);
        const res = await updateGlobalSettings(formData).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? 'Settings updated successfully');
        }
      } catch {
        toast.error('Failed to update settings. Please try again.');
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik;

  const existingOgImage = typeof data?.og_image === 'string' ? data.og_image : null;

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (e.g. JPG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
      setOgImageFile(file);
      setOgImagePreviewUrl(URL.createObjectURL(file));
      ogImageIsObjectUrlRef.current = true;
      setFieldValue('og_image', file);
      setFieldTouched('og_image', true);
    }
    e.target.value = '';
  };

  const clearOgImage = () => {
    if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    setOgImageFile(null);
    setOgImagePreviewUrl(existingOgImage);
    ogImageIsObjectUrlRef.current = false;
    setFieldValue('og_image', existingOgImage);
    setFieldTouched('og_image', true);
  };

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
    <Card className="admin-surface p-6">
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
        <form onSubmit={handleSubmit} className="space-y-6">

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
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          if (!file.type.startsWith('image/')) {
                            toast.error('Please select an image file (e.g. JPG, PNG)');
                            e.target.value = '';
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error('Image must be less than 2MB');
                            e.target.value = '';
                            return;
                          }
                        }
                        setLogoFile(file);
                      }}
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
                  ['tiktok_link', 'TikTok', 'https://tiktok.com/@...'],
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

          <OpenGraphFieldsSection
            idPrefix="global-settings"
            values={{
              meta_title: values.meta_title,
              meta_description: values.meta_description,
              og_title: values.og_title,
              og_description: values.og_description,
              og_image: values.og_image,
              json_ld: values.json_ld,
            }}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            disabled={isUpdating || formik.isSubmitting}
            ogImagePreviewUrl={ogImagePreviewUrl ?? existingOgImage}
            ogImageFileName={ogImageFile?.name ?? null}
            onOgImageChange={handleOgImageChange}
            onOgImageClear={clearOgImage}
          />

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
