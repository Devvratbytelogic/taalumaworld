export interface IMyBooksAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IMyBooksAPIResponseData;
    message: string;
    timestamp: string;
}

export interface IMyBooksAPIResponseData {
    summary: IMyBooksSummary;
    items?: IMyBookItem[] | null;
    pagination: IMyBooksPagination;
}

export interface IMyBooksSummary {
    totalBooks: number;
    inProgress: number;
    completed: number;
    unread: number;
}

export interface IMyBookItem {
    bookId: string;
    id: string;
    title: string;
    description: string;
    coverImage: string;
    chapterCount: number;
    pricingModel: string;
    price: number;
    author: string;
    authorAvatar: string | null;
    category: IMyBooksCategory;
    subcategory: IMyBooksCategory | null;
    accessType: string;
    readStatus: string;
    progressPercent: number;
    completed: boolean;
    lastChapterRead?: string | null;
}

export interface IMyBooksCategory {
    _id: string;
    name: string;
    slug: string;
}

export interface IMyBooksPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}
