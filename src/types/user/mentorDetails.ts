export interface IUserMentorDetailsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IUserMentorDetailsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IUserMentorDetailsAPIResponseData {
  mentor_info: IMentorInfo;
  books: IMentorBooks;
}
export interface IMentorInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  role_id: IRoleId;
  professionalBio: string;
  profile_pic: string;
  facebook: string;
  linkedin: string;
  short_code: string;
  id: string;
  isFollowed?: boolean;
  followerCount?: number;
  is_verified_mentor?: boolean;
}
export interface IRoleId {
  _id: string;
  name: string;
  id: string;
}
export interface IMentorBooks {
  data?: (IMentorBookEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IMentorBookEntity {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  status: string;
  pricingModel: string;
  price: number;
  tags?: (string)[] | null;
  deletedAt?: string | null;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
