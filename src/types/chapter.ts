/** Payload for POST /admin/chapters (add chapter) */
export interface AddChapterPayload {
  book: string;
  number: number;
  title: string;
  description: string;
  content: string;
  isFree: boolean;
  price: number;
  status: string;
}

/** Payload for PUT /admin/chapters/:id (update chapter) */
export interface UpdateChapterPayload {
  book: string;
  number: number;
  title: string;
  description: string;
  content?: string;
  isFree: boolean;
  price: number;
  status?: string;
  page?: number;
}

export interface IAllChaptersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllChaptersAPIResponseDataEntity)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllChaptersAPIResponseDataEntity {
    coverImage?: string | null;
    _id: string;
    book: Book;
    number: number;
    title: string;
    description: string;
    content: string;
    isFree: boolean;
    price: number;
    status: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
    page?: number | null;
  }
  export interface Book {
    _id: string;
    title: string;
    thoughtLeader: ThoughtLeader;
    category: string;
    subcategory?: null;
    description: string;
    coverImage: string;
    pricingModel: string;
    price: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    deletedAt?: string | null;
    tags?: (string | null)[] | null;
    id: string;
  }
  export interface ThoughtLeader {
    deletedAt?: null;
    _id: string;
    fullName: string;
    email: string;
    professionalBio: string;
    avatar: string;
    status: string;
    followersCount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  