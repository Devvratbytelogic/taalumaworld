'use client';

import { useCallback, useRef, useState } from 'react';
import { FileText, ImagePlus, Loader2, Save, Settings, X } from 'lucide-react';
import { useFormik } from 'formik';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import Button from '../../ui/Button';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { refreshAfterSettingsChange } from '@/store/server-api/refreshCache';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { globalSettingsSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import AdminSettingsSkeleton from '@/components/skeleton-loader/AdminSettingsSkeleton';
import { appendOpenGraphFieldsToFormData, OPEN_GRAPH_FORM_FIELD_KEYS, OpenGraphFieldsSection } from '@/components/admin/shared/OpenGraphFieldsSection';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';
import { ALLOWED_IMAGE_ACCEPT, IMAGE_UPLOAD_MAX_BYTES, PDF_UPLOAD_MAX_MB, PDF_UPLOAD_MAX_BYTES, getImageSizeLimitMessage, getImageTypeErrorMessage, isAllowedImageFile } from '@/constants/fileUpload';

const MENTOR_GUIDE_ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function isMentorGuideFile(file: File) {
  return /\.(pdf|docx)$/i.test(file.name);
}

function guideFileLabel(url: string) {
  const name = decodeURIComponent(url.split('?')[0].split('/').pop() || '');
  return name || 'Current mentor guide';
}

const SETTING_MODEL = 'Setting';

const defaultValues = {
  platformName: '',
  platformDescription: '',
  supportEmail: '',
  email: '',
  phone: '',
  alt_phone: '',
  address: '',
  copy_right_text: '',
  default_tax_rate: 0,
  minimum_content_price: 0,
  header_text: '',
  header_text_status: false,
  visible: 'chapter',
  checkout_status: false,
  mentor_section_visibility: true,
  android_app_url: '',
  iphone_app_url: '',
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: null as File | string | null,
  twitter_title: '',
  twitter_description: '',
  twitter_image: null as File | string | null,
  json_ld: '',
  google_analytics_id: '',
  google_tag_manager: '',
  facebook_pixel: '',
  facebook_domain_verification: '',
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

function NotificationToggle({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-input bg-gray-50 px-4 py-3">
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function GeneralSettingsCard() {
  const { data: res, isLoading } = useGetAdminGlobalSettingsQuery();
  const [updateGlobalSettings, { isLoading: isUpdating }] = useUpdateGlobalSettingsMutation();
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission(SETTING_MODEL, 'edit');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mentorGuideFile, setMentorGuideFile] = useState<File | null>(null);
  const mentorGuideInputRef = useRef<HTMLInputElement>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreviewUrl, setOgImagePreviewUrl] = useState<string | null>(null);
  const [ogImageRemoved, setOgImageRemoved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ogImageIsObjectUrlRef = useRef(false);
  const skipOgImagePrefillRef = useRef(false);

  const data = res?.data;

  const initialValues: FormValues = {
    platformName: data?.platformName ?? '',
    platformDescription: data?.platformDescription ?? '',
    supportEmail: data?.supportEmail ?? '',
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    alt_phone: data?.alt_phone ?? '',
    address: data?.address ?? '',
    copy_right_text: data?.copy_right_text ?? '',
    default_tax_rate: data?.default_tax_rate ?? 0,
    minimum_content_price: data?.minimum_content_price ?? 0,
    header_text: data?.header_text ?? '',
    header_text_status: data?.header_text_status ?? false,
    visible: data?.visible ?? 'chapter',
    checkout_status: data?.checkout_status ?? false,
    mentor_section_visibility: data?.mentor_section_visibility ?? true,
    android_app_url: data?.android_app_url ?? '',
    iphone_app_url: data?.iphone_app_url ?? '',
    meta_title: data?.meta_title ?? '',
    meta_description: data?.meta_description ?? '',
    og_title: data?.og_title ?? data?.og_tag ?? '',
    og_description: data?.og_description ?? '',
    og_image: data?.og_image ?? null,
    twitter_title: data?.twitter_title ?? '',
    twitter_description: data?.twitter_description ?? '',
    twitter_image: data?.twitter_image ?? null,
    json_ld: data?.json_ld ?? data?.schema_markup ?? '',
    google_analytics_id: data?.google_analytics_id ?? '',
    google_tag_manager: data?.google_tag_manager ?? '',
    facebook_pixel: data?.facebook_pixel ?? '',
    facebook_domain_verification: data?.facebook_domain_verification ?? '',
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
          if ((OPEN_GRAPH_FORM_FIELD_KEYS as readonly string[]).includes(key)) return;
          formData.append(key, String(values[key]));
        });
        if (logoFile) formData.append('logo', logoFile);
        if (mentorGuideFile) formData.append('mentor_guide', mentorGuideFile);
        appendOpenGraphFieldsToFormData(formData, {
          meta_title: values.meta_title,
          meta_description: values.meta_description,
          og_title: values.og_title,
          og_description: values.og_description,
          twitter_title: values.twitter_title,
          twitter_description: values.twitter_description,
          json_ld: values.json_ld,
          ogImage: ogImageFile ?? values.og_image,
          twitterImage: values.twitter_image,
        });
        const res = await updateGlobalSettings(formData).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          skipOgImagePrefillRef.current = false;
          setOgImageRemoved(false);
          setMentorGuideFile(null);
          if (mentorGuideInputRef.current) mentorGuideInputRef.current.value = '';
          void refreshAfterSettingsChange();
          toast.success(res.message ?? 'Settings updated successfully');
        }
      } catch {
        // Error toast handled by API layer
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik;

  const existingOgImage = typeof data?.og_image === 'string' ? data.og_image : null;

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isAllowedImageFile(file)) {
        toast.error(getImageTypeErrorMessage());
        return;
      }
      if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
        toast.error(getImageSizeLimitMessage());
        return;
      }
      skipOgImagePrefillRef.current = true;
      setOgImageRemoved(false);
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
    skipOgImagePrefillRef.current = true;
    if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    setOgImageFile(null);
    setOgImagePreviewUrl(null);
    setOgImageRemoved(true);
    ogImageIsObjectUrlRef.current = false;
    setFieldValue('og_image', null);
    setFieldTouched('og_image', true);
  };

  const handleOgImagePrefill = useCallback(
    ({ file, previewUrl }: { file: File | null; previewUrl: string | null }) => {
      if (skipOgImagePrefillRef.current) return;
      if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
      if (file) {
        setOgImageFile(file);
        setOgImagePreviewUrl(URL.createObjectURL(file));
        ogImageIsObjectUrlRef.current = true;
        setFieldValue('og_image', file);
        return;
      }
      setOgImageFile(null);
      setOgImagePreviewUrl(previewUrl);
      ogImageIsObjectUrlRef.current = false;
      setFieldValue('og_image', previewUrl);
    },
    [ogImagePreviewUrl, setFieldValue],
  );

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
              <div>
                <Label htmlFor="platformName">Platform Name <span className="text-red-500">*</span></Label>
                <Input {...field('platformName')} />
                <FieldError msg={touched.platformName ? errors.platformName : ''} />
              </div>
              <div>
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Textarea {...field('platformDescription')} rows={3} />
                <FieldError msg={touched.platformDescription ? errors.platformDescription : ''} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportEmail">Support Email <span className="text-red-500">*</span></Label>
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
              <div>
                <Label htmlFor="minimum_content_price">Minimum content price (KSH)</Label>
                <Input type="number" min={0} step="0.01" {...field('minimum_content_price')} />
                <FieldError msg={touched.minimum_content_price ? errors.minimum_content_price : ''} />
              </div>

              {/* Logo upload */}
              <div>
                <Label>
                  Platform Logo
                  <FileUploadLimitHint kind="image" />
                </Label>
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
                      accept={ALLOWED_IMAGE_ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          if (!isAllowedImageFile(file)) {
                            toast.error(getImageTypeErrorMessage());
                            e.target.value = '';
                            return;
                          }
                          if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
                            toast.error(getImageSizeLimitMessage());
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
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Display ── */}
          <section>
            <SectionHeading title="Display" />
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Mentor Section Visibility</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {values.mentor_section_visibility
                    ? 'Mentor section is visible on the site'
                    : 'Mentor section is hidden on the site'}
                </p>
              </div>
              <Switch
                checked={values.mentor_section_visibility}
                onCheckedChange={(checked) => setFieldValue('mentor_section_visibility', checked)}
              />
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
                <Label htmlFor="facebook_domain_verification">Facebook Domain Verification</Label>
                <Input {...field('facebook_domain_verification')} placeholder="facebook-domain-verification" />
                <FieldError msg={touched.facebook_domain_verification ? errors.facebook_domain_verification : ''} />
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

          {/* ── Mentor guide ── */}
          <section>
            <SectionHeading title="Mentor Guide" />
            <div>
              <Label htmlFor="mentor_guide">
                Writing and publishing guide
                <FileUploadLimitHint kind="pdf" />
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF or DOCX file for mentors. Upload replaces the current file when you save.
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={mentorGuideInputRef}
                  id="mentor_guide"
                  type="file"
                  accept={MENTOR_GUIDE_ACCEPT}
                  className="hidden"
                  disabled={!canEdit}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (!file) {
                      setMentorGuideFile(null);
                      return;
                    }
                    if (!isMentorGuideFile(file)) {
                      toast.error('Please select a PDF or DOCX file');
                      e.target.value = '';
                      return;
                    }
                    if (file.size > PDF_UPLOAD_MAX_BYTES) {
                      toast.error(`File must be less than ${PDF_UPLOAD_MAX_MB}MB`);
                      e.target.value = '';
                      return;
                    }
                    setMentorGuideFile(file);
                  }}
                />
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => mentorGuideInputRef.current?.click()}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-dashed border-input bg-gray-50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  {mentorGuideFile ? (
                    <span className="truncate font-medium text-foreground">{mentorGuideFile.name}</span>
                  ) : (
                    <span>Click to select a mentor guide</span>
                  )}
                </button>
                {mentorGuideFile ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMentorGuideFile(null);
                      if (mentorGuideInputRef.current) mentorGuideInputRef.current.value = '';
                    }}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                ) : null}
              </div>
              {typeof data?.mentor_guide === 'string' && data.mentor_guide ? (
                <a
                  href={data.mentor_guide}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-sm text-primary underline underline-offset-2"
                >
                  {mentorGuideFile ? 'Current file' : guideFileLabel(data.mentor_guide)}
                </a>
              ) : null}
            </div>
          </section>

          {/* ── Notifications ── */}
          <section>
            <SectionHeading title="Email Notifications" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NotificationToggle
                id="emailNotificationsNewUsers"
                label="New user registrations"
                checked={values.emailNotificationsNewUsers}
                onCheckedChange={(checked) => setFieldValue('emailNotificationsNewUsers', checked)}
              />
              <NotificationToggle
                id="emailNotificationsPurchases"
                label="New purchases"
                checked={values.emailNotificationsPurchases}
                onCheckedChange={(checked) => setFieldValue('emailNotificationsPurchases', checked)}
              />
              <NotificationToggle
                id="dailySummaryReports"
                label="Daily summary reports"
                checked={values.dailySummaryReports}
                onCheckedChange={(checked) => setFieldValue('dailySummaryReports', checked)}
              />
              <NotificationToggle
                id="alertFlaggedContent"
                label="Alert on flagged content"
                checked={values.alertFlaggedContent}
                onCheckedChange={(checked) => setFieldValue('alertFlaggedContent', checked)}
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
              twitter_title: values.twitter_title,
              twitter_description: values.twitter_description,
              twitter_image: values.twitter_image,
              json_ld: values.json_ld,
            }}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            sourceTitle={values.platformName}
            sourceDescription={values.platformDescription}
            sourceImageFile={logoFile}
            sourceImagePreviewUrl={typeof data?.logo === 'string' ? data.logo : null}
            schemaType="WebSite"
            disabled={isUpdating || formik.isSubmitting}
            ogImagePreviewUrl={ogImageRemoved ? null : (ogImagePreviewUrl ?? existingOgImage)}
            ogImageFileName={ogImageFile?.name ?? null}
            onOgImageChange={handleOgImageChange}
            onOgImageClear={clearOgImage}
            onOgImagePrefill={handleOgImagePrefill}
          />

          {canEdit ? (
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
          ) : null}
        </form>
      )}
    </Card>
  );
}
