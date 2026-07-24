import { IMentor } from "./singleBook";

export interface ISingleChapterAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleChapterAPIResponseData;
  message: string;
  timestamp: string;
}
export interface ISingleChapterAPIResponseData {
  id: string;
  slug: string;
  type: string;
  chapterNumber: number;
  shareable_link: string;
  title: string;
  description: string;
  pageCount: number;
  content: string;
  pdf: string;
  price: number;
  effectivePrice: number;
  pricingAccessType: string;
  isFree: boolean;
  coverImage: string;
  bookId: string;
  bookTitle: string;
  series: Series;
  tags?: (string)[] | null;
  mentor: string;
  canRead: boolean;
  isPurchased: boolean;
  isCart: boolean;
  isWishlisted: boolean;
  percentage: number;
  completed: boolean;
  readStatus: string;
  createdBy: IMentor;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  json_ld: string;
  legacyType: string;
  seriesId: string;
  seriesTitle: string;
  blueprintNumber: number;
}
export interface Series {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  effectivePrice: number;
  pricingAccessType: string;
  pricingModel: string;
  tags?: (string)[] | null;
  totalPages: number;
  chapterCount: number;
  isChapterPricing: boolean;
  priceLabel: string;
  fromPrice: number;
  mentor: Mentor;
  isPurchased: boolean;
  canRead: boolean;
  isCart: boolean;
  isWishlisted: boolean;
  legacyType: string;
}
export interface Mentor {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  is_verified: boolean;
  is_mentor_verified: boolean;
  linkedin: string;
  facebook: string;
}