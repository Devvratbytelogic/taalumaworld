import type { IGlobalSettings } from '@/types/globalSettings';

export type PublicSiteSettings = Pick<
  IGlobalSettings,
  | 'marketplace_name'
  | 'platformName'
  | 'supportEmail'
  | 'email'
  | 'phone'
  | 'address'
  | 'copy_right_text'
  | 'logo'
  | 'instagram_link'
  | 'facebook_link'
  | 'tiktok_link'
  | 'x_link'
  | 'youtube_link'
  | 'linkdin_link'
  | 'pinterest_link'
  | 'whatsapp_link'
>;

export function toPublicSiteSettings(settings: IGlobalSettings | null): PublicSiteSettings | null {
  if (!settings) return null;

  return {
    marketplace_name: settings.marketplace_name,
    platformName: settings.platformName,
    supportEmail: settings.supportEmail,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    copy_right_text: settings.copy_right_text,
    logo: settings.logo,
    instagram_link: settings.instagram_link,
    facebook_link: settings.facebook_link,
    tiktok_link: settings.tiktok_link,
    x_link: settings.x_link,
    youtube_link: settings.youtube_link,
    linkdin_link: settings.linkdin_link,
    pinterest_link: settings.pinterest_link,
    whatsapp_link: settings.whatsapp_link,
  };
}
